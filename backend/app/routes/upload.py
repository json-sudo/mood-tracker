"""
File upload route for avatar images.

Supports two modes:
1. UploadThing (when UPLOADTHING_SECRET is configured)
2. Local base64 storage (fallback for development)
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import JSONResponse
import base64
import os
from typing import Optional

from app.middleware.auth import get_current_user
from app.models.user import UserInDB

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
MAX_SIZE = 2 * 1024 * 1024  # 2MB


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: UserInDB = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only JPEG, PNG, and WebP images are allowed."
        )
    
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 2MB."
        )
    
    uploadthing_secret = os.getenv("UPLOADTHING_SECRET")
    
    if uploadthing_secret:
        # TODO: Implement UploadThing upload when configured
        # For now, fall through to base64
        pass
    
    # Fallback: Convert to base64 data URL
    try:
        base64_data = base64.b64encode(contents).decode('utf-8')
        data_url = f"data:{file.content_type};base64,{base64_data}"
        
        return JSONResponse({
            "url": data_url,
            "success": True,
            "size": len(contents),
            "type": file.content_type,
        })
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )
