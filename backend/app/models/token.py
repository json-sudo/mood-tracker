from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str  # user_id
    exp: int  # expiration timestamp
    type: str  # "access" or "refresh"


class RefreshTokenRequest(BaseModel):
    refresh_token: str
