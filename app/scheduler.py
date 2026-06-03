from apscheduler.schedulers.background import BackgroundScheduler

from app.feed_collector import collect_feeds

scheduler = BackgroundScheduler()

scheduler.add_job(
    collect_feeds,
    "interval",
    minutes=30
)

scheduler.start()