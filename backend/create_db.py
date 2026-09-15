import asyncio
import asyncpg

async def create_db():
    # Connect to the default 'postgres' database to create 'resq_ai'
    try:
        conn = await asyncpg.connect(user='postgres', password='nitin$11122', host='localhost', port=5432, database='postgres')
        # Check if database exists
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = 'resq_ai'")
        if not exists:
            await conn.execute('CREATE DATABASE resq_ai')
            print("Database resq_ai created.")
        else:
            print("Database resq_ai already exists.")
        await conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")

asyncio.run(create_db())
