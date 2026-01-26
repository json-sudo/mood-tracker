from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    avatar_url: Optional[str] = None


class User(UserBase):
    id: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserInDB(UserBase):
    id: str
    password_hash: str
    avatar_url: Optional[str] = None
    created_at: datetime
