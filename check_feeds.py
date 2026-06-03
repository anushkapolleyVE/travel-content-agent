from app.database import SessionLocal
from app.models import Feed

db = SessionLocal()

feeds = db.query(Feed).all()

print(f"Total feeds: {len(feeds)}")

for feed in feeds[:5]:
    print(feed.title)