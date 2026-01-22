from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import IntEnum


class MoodLevel(IntEnum):
    """Mood scale from -2 (very sad) to +2 (very happy)."""
    VERY_SAD = -2
    SAD = -1
    NEUTRAL = 0
    HAPPY = 1
    VERY_HAPPY = 2


class MoodEntryBase(BaseModel):
    """Base mood entry schema."""
    mood: int = Field(..., ge=-2, le=2, description="Mood level from -2 to 2")
    feelings: list[str] = Field(default_factory=list, max_length=10)
    reflection: Optional[str] = Field(None, max_length=1000)
    sleep_hours: float = Field(..., ge=0, le=24, description="Hours of sleep")


class MoodEntryCreate(MoodEntryBase):
    """Schema for creating a mood entry."""
    pass


class MoodEntry(MoodEntryBase):
    """Public mood entry schema (returned in responses)."""
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class MoodEntryInDB(MoodEntryBase):
    """Internal mood entry schema."""
    id: str
    user_id: str
    created_at: datetime


class MoodAverages(BaseModel):
    """Schema for mood and sleep averages comparison."""
    current_mood_avg: float = Field(..., description="Average mood from last 5 entries")
    current_sleep_avg: float = Field(..., description="Average sleep from last 5 entries")
    previous_mood_avg: Optional[float] = Field(None, description="Average mood from previous 5 entries")
    previous_sleep_avg: Optional[float] = Field(None, description="Average sleep from previous 5 entries")
    mood_trend: str = Field(..., description="increase, decrease, or same")
    sleep_trend: str = Field(..., description="increase, decrease, or same")
    entries_count: int = Field(..., description="Total number of entries used")
