from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import get_settings

settings = get_settings()


class Database:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


database = Database()


async def connect_to_database():
    database.client = AsyncIOMotorClient(settings.mongodb_url)
    database.db = database.client[settings.database_name]
    
    await database.db.users.create_index("email", unique=True)
    await database.db.entries.create_index([("user_id", 1), ("created_at", -1)])
    
    print(f"Connected to MongoDB: {settings.database_name}")


async def close_database_connection():
    if database.client:
        database.client.close()
        print("Closed MongoDB connection")


def get_database() -> AsyncIOMotorDatabase:
    if database.db is None:
        raise RuntimeError("Database not initialized")
    return database.db
