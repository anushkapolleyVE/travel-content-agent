from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:pass123@localhost:5432/postgres"

try:
    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        print("Connected Successfully!")

except Exception as e:
    print("Error:", e)