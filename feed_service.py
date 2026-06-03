from app.database import SessionLocal
from app.models import Feed
from app.rss_agent import get_articles

db = SessionLocal()

articles = get_articles()

for article in articles:

    exists = db.query(Feed).filter(
        Feed.link == article["link"]
    ).first()

    if not exists:

        feed = Feed(
            title=article["title"],
            link=article["link"],
            summary=article["summary"]
        )

        db.add(feed)

db.commit()

print("Feeds saved!")