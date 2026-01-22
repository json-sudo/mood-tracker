from pydantic import BaseModel


class Token(BaseModel):
    """JWT token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """JWT token payload schema."""
    sub: str  # user_id
    exp: int  # expiration timestamp
    type: str  # "access" or "refresh"


class RefreshTokenRequest(BaseModel):
    """Request schema for token refresh."""
    refresh_token: str
