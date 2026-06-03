import feedparser
from app.database import SessionLocal
from app.models import Feed

RSS_FEEDS = [
    "https://www.iamsterdam.com/en/rss",
    "https://www.sortiraparis.com/en/feed",
    "https://www.expatica.com/fr/feed",
]

def collect_feeds():

    db = SessionLocal()

    for url in RSS_FEEDS:

        feed = feedparser.parse(url)

        for entry in feed.entries:

            existing = db.query(Feed).filter(
                Feed.link == entry.link
            ).first()

            if existing:
                continue

            new_feed = Feed(
                title=entry.title,
                link=entry.link,
                summary=getattr(entry, "summary", "")
            )

            db.add(new_feed)

    db.commit()