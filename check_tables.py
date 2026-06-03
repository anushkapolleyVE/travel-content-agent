from sqlalchemy import create_engine
from sqlalchemy import text

engine = create_engine(
    "postgresql://postgres:pass123@localhost:5432/content_agent"
)

with engine.connect() as conn:

    result = conn.execute(
        text("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public'
        """)
    )

    for row in result:
        print(row[0])