from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.database import connect_to_database, close_database_connection
from app.routes import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_database()
    yield
    await close_database_connection()


app = FastAPI(
    title="Mood Tracker API",
    description="A fullstack mood tracking application API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
