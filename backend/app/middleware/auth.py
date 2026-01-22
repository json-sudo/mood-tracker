from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database import get_database
from app.services.auth import decode_token
from app.models.user import UserInDB

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> UserInDB:
    """
    Dependency that validates the JWT token and returns the current user.
    Use this in route dependencies to protect endpoints.
    """
    token = credentials.credentials
    
    # Decode and validate the token
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Ensure it's an access token, not a refresh token
    if payload.type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from database
    user_doc = await db.users.find_one({"_id": payload.sub})
    if user_doc is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return UserInDB(
        id=str(user_doc["_id"]),
        email=user_doc["email"],
        name=user_doc["name"],
        password_hash=user_doc["password_hash"],
        avatar_url=user_doc.get("avatar_url"),
        created_at=user_doc["created_at"],
    )
