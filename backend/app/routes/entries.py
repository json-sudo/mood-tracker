from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone, timedelta
import uuid

from app.database import get_database
from app.middleware.auth import get_current_user
from app.models.user import UserInDB
from app.models.entry import MoodEntry, MoodEntryCreate, MoodAverages

router = APIRouter()


def get_today_range() -> tuple[datetime, datetime]:
    """Get the start and end of today in UTC."""
    now = datetime.now(timezone.utc)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + timedelta(days=1)
    return start_of_day, end_of_day


@router.get("", response_model=list[MoodEntry])
async def get_entries(
    limit: int = 11,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(get_current_user),
):
    """Get the user's mood entries, ordered by most recent first."""
    cursor = db.entries.find(
        {"user_id": current_user.id}
    ).sort("created_at", -1).limit(limit)

    entries = []
    async for doc in cursor:
        entries.append(MoodEntry(
            id=str(doc["_id"]),
            user_id=doc["user_id"],
            mood=doc["mood"],
            feelings=doc["feelings"],
            reflection=doc.get("reflection"),
            sleep_hours=doc["sleep_hours"],
            created_at=doc["created_at"],
        ))

    return entries


@router.get("/today", response_model=MoodEntry | None)
async def get_today_entry(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(get_current_user),
):
    """Get today's mood entry if it exists."""
    start_of_day, end_of_day = get_today_range()

    doc = await db.entries.find_one({
        "user_id": current_user.id,
        "created_at": {"$gte": start_of_day, "$lt": end_of_day},
    })

    if not doc:
        return None

    return MoodEntry(
        id=str(doc["_id"]),
        user_id=doc["user_id"],
        mood=doc["mood"],
        feelings=doc["feelings"],
        reflection=doc.get("reflection"),
        sleep_hours=doc["sleep_hours"],
        created_at=doc["created_at"],
    )


@router.post("", response_model=MoodEntry, status_code=status.HTTP_201_CREATED)
async def create_entry(
    entry_data: MoodEntryCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(get_current_user),
):
    """Create a new mood entry. Only one entry per day is allowed."""
    start_of_day, end_of_day = get_today_range()

    # Check if entry already exists for today
    existing = await db.entries.find_one({
        "user_id": current_user.id,
        "created_at": {"$gte": start_of_day, "$lt": end_of_day},
    })

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already logged your mood today",
        )

    # Create the entry
    entry_id = str(uuid.uuid4())
    entry_doc = {
        "_id": entry_id,
        "user_id": current_user.id,
        "mood": entry_data.mood,
        "feelings": entry_data.feelings,
        "reflection": entry_data.reflection,
        "sleep_hours": entry_data.sleep_hours,
        "created_at": datetime.now(timezone.utc),
    }

    await db.entries.insert_one(entry_doc)

    return MoodEntry(
        id=entry_id,
        user_id=entry_doc["user_id"],
        mood=entry_doc["mood"],
        feelings=entry_doc["feelings"],
        reflection=entry_doc["reflection"],
        sleep_hours=entry_doc["sleep_hours"],
        created_at=entry_doc["created_at"],
    )


@router.get("/averages", response_model=MoodAverages)
async def get_averages(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Calculate mood and sleep averages.
    Compares the last 5 entries with the previous 5 entries.
    """
    # Get last 10 entries
    cursor = db.entries.find(
        {"user_id": current_user.id}
    ).sort("created_at", -1).limit(10)

    entries = []
    async for doc in cursor:
        entries.append({
            "mood": doc["mood"],
            "sleep_hours": doc["sleep_hours"],
        })

    total_entries = len(entries)

    if total_entries == 0:
        return MoodAverages(
            current_mood_avg=0,
            current_sleep_avg=0,
            previous_mood_avg=None,
            previous_sleep_avg=None,
            mood_trend="same",
            sleep_trend="same",
            entries_count=0,
        )

    # Calculate current averages (last 5 or fewer)
    current_entries = entries[:min(5, total_entries)]
    current_mood_avg = sum(e["mood"] for e in current_entries) / len(current_entries)
    current_sleep_avg = sum(e["sleep_hours"] for e in current_entries) / len(current_entries)

    # Calculate previous averages (entries 6-10)
    previous_entries = entries[5:10] if total_entries > 5 else []
    
    if previous_entries:
        previous_mood_avg = sum(e["mood"] for e in previous_entries) / len(previous_entries)
        previous_sleep_avg = sum(e["sleep_hours"] for e in previous_entries) / len(previous_entries)
    else:
        previous_mood_avg = None
        previous_sleep_avg = None

    # Determine trends
    def get_trend(current: float, previous: float | None) -> str:
        if previous is None:
            return "same"
        diff = current - previous
        if diff > 0.1:
            return "increase"
        elif diff < -0.1:
            return "decrease"
        return "same"

    return MoodAverages(
        current_mood_avg=round(current_mood_avg, 2),
        current_sleep_avg=round(current_sleep_avg, 2),
        previous_mood_avg=round(previous_mood_avg, 2) if previous_mood_avg is not None else None,
        previous_sleep_avg=round(previous_sleep_avg, 2) if previous_sleep_avg is not None else None,
        mood_trend=get_trend(current_mood_avg, previous_mood_avg),
        sleep_trend=get_trend(current_sleep_avg, previous_sleep_avg),
        entries_count=total_entries,
    )
