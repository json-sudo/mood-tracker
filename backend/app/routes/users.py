from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.middleware.auth import get_current_user
from app.models.user import User, UserInDB, UserUpdate

router = APIRouter()


@router.get("/me", response_model=User)
async def get_current_user_profile(
    current_user: UserInDB = Depends(get_current_user),
):
    return User(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
        created_at=current_user.created_at,
    )


@router.patch("/me", response_model=User)
async def update_current_user_profile(
    user_update: UserUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserInDB = Depends(get_current_user),
):
    update_data = {}
    if user_update.name is not None:
        update_data["name"] = user_update.name
    if user_update.avatar_url is not None:
        update_data["avatar_url"] = user_update.avatar_url

    if update_data:
        await db.users.update_one(
            {"_id": current_user.id},
            {"$set": update_data},
        )

    user_doc = await db.users.find_one({"_id": current_user.id})

    return User(
        id=str(user_doc["_id"]),
        email=user_doc["email"],
        name=user_doc["name"],
        avatar_url=user_doc.get("avatar_url"),
        created_at=user_doc["created_at"],
    )
