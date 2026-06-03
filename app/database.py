from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

DATABASE_URL = (
<<<<<<< Updated upstream
    "postgresql://postgres:Pass123@localhost:5432/content_agent"
=======
    "postgresql://postgres:Pass#123@localhost:5432/content_agent"
>>>>>>> Stashed changes
)

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as connection:
        print("Database connected successfully.")
except OperationalError as e:
    print(e)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)