import asyncio
import logging
from sqlalchemy import select
from app.database import engine, Base, AsyncSessionLocal
from app.db_models import User
from app.auth import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed_admin")

async def seed():
    # Make sure tables are created
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if admin already exists
        result = await session.execute(select(User).where(User.username == "admin"))
        admin = result.scalars().first()
        
        if not admin:
            hashed_pwd = get_password_hash("admin123")
            new_admin = User(username="admin", password_hash=hashed_pwd, role="ADMIN")
            session.add(new_admin)
            await session.commit()
            logger.info("Created default admin user (admin/admin123)")
        else:
            logger.info("Admin user already exists.")

if __name__ == "__main__":
    asyncio.run(seed())
