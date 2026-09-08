from apscheduler.schedulers.background import BackgroundScheduler
from app.feed_collector import collect_feeds

scheduler = BackgroundScheduler()

scheduler.add_job(
    collect_feeds,
    "interval",
    minutes=30
)


def start_scheduler():
    """Start the background feed collection scheduler."""
    if not scheduler.running:
        scheduler.start()
        print("RSS feed scheduler started (every 30 min)")