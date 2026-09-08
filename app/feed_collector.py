import feedparser
from app.database import SessionLocal
from app.models import Feed

RSS_FEEDS = [
    "https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml",
]


def collect_feeds():
    """Fetch RSS feeds and save new entries to the database."""

    db = SessionLocal()
    added = 0

    try:
        for url in RSS_FEEDS:
            try:
                feed = feedparser.parse(url)

                if feed.bozo:
                    print(f"Warning: Feed parse error for {url}")

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
                    added += 1

            except Exception as e:
                print(f"Error fetching feed {url}: {e}")
                continue

        db.commit()

    except Exception as e:
        db.rollback()
        print(f"Error committing feeds: {e}")
        raise

    finally:
        db.close()

    return added