from app.database import SessionLocal
from app.models import PublishingQueue


def publish_post(queue_id):
    """Mark a publishing queue item as published."""

    db = SessionLocal()

    try:
        item = db.query(
            PublishingQueue
        ).filter(
            PublishingQueue.id == queue_id
        ).first()

        if not item:
            return False

        item.status = "published"
        db.commit()
        return True

    except Exception as e:
        db.rollback()
        print(f"Error publishing post {queue_id}: {e}")
        return False

    finally:
        db.close()