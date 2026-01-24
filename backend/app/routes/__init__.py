from fastapi import APIRouter
from app.routes import auth, entries, users, upload

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(entries.router, prefix="/entries", tags=["Mood Entries"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(upload.router, prefix="/upload", tags=["File Upload"])
