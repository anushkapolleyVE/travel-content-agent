from app.database import SessionLocal
from app.models import PublishingQueue

def publish_post(queue_id):

    db = SessionLocal()

    item = db.query(
        PublishingQueue
    ).filter(
        PublishingQueue.id == queue_id
    ).first()

    item.status = "published"

    db.commit()

    return True