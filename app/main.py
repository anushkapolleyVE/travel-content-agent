from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, get_db
from app.models import Base, Feed, Draft, PublishingQueue
from app.content_agent import generate_blog
from app.feed_collector import collect_feeds
from app.social_agent import publish_post
from app.scheduler import start_scheduler


# -------------------------
# App Lifecycle
# -------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup and start the RSS scheduler."""
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables ready")
    except Exception as e:
        print(f"Warning: Could not create tables: {e}")
    try:
        start_scheduler()
    except Exception as e:
        print(f"Warning: Could not start scheduler: {e}")
    print("Travel Content Agent started")
    yield
    print("Travel Content Agent shutting down")


app = FastAPI(
    title="Travel Content Agent",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Home
# -------------------------

@app.get("/")
def home():
    return {
        "message": "Travel Content Agent Running"
    }


# -------------------------
# Stats
# -------------------------

@app.get("/stats")
def stats(db: Session = Depends(get_db)):
    return {
        "feeds": db.query(Feed).count(),
        "drafts": db.query(Draft).count(),
        "queue": db.query(PublishingQueue).count()
    }


# -------------------------
# Collect Feeds
# -------------------------

@app.post("/collect")
def collect(db: Session = Depends(get_db)):
    """Manually trigger RSS feed collection."""
    try:
        added = collect_feeds()
        total = db.query(Feed).count()
        return {
            "message": f"Collected {added} new feeds",
            "total": total
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to collect feeds: {str(e)}"
        )


# -------------------------
# Feed API
# -------------------------

@app.get("/feeds")
def get_feeds(db: Session = Depends(get_db)):
    feeds = db.query(Feed).order_by(Feed.id.desc()).all()
    return [
        {
            "id": feed.id,
            "title": feed.title,
            "summary": feed.summary,
            "status": feed.status
        }
        for feed in feeds
    ]


# -------------------------
# Approve Feed
# -------------------------

@app.post("/approve/{feed_id}")
def approve(feed_id: int, db: Session = Depends(get_db)):
    feed = db.query(Feed).filter(
        Feed.id == feed_id
    ).first()

    if not feed:
        raise HTTPException(
            status_code=404,
            detail="Feed not found"
        )

    feed.status = "approved"
    db.commit()

    return {"message": "Feed approved", "id": feed_id}


# -------------------------
# Reject Feed
# -------------------------

@app.post("/reject/{feed_id}")
def reject(feed_id: int, db: Session = Depends(get_db)):
    feed = db.query(Feed).filter(
        Feed.id == feed_id
    ).first()

    if not feed:
        raise HTTPException(
            status_code=404,
            detail="Feed not found"
        )

    feed.status = "rejected"
    db.commit()

    return {"message": "Feed rejected", "id": feed_id}


# -------------------------
# Generate Blog
# -------------------------

@app.post("/generate/{feed_id}")
def generate(feed_id: int, db: Session = Depends(get_db)):
    feed = db.query(Feed).filter(
        Feed.id == feed_id
    ).first()

    if not feed:
        raise HTTPException(
            status_code=404,
            detail="Feed not found"
        )

    try:
        content = generate_blog(
            feed.title,
            feed.summary
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate blog: {str(e)}"
        )

    draft = Draft(
        feed_id=feed.id,
        title=feed.title,
        content=content
    )

    db.add(draft)
    feed.status = "generated"
    db.commit()

    return {"message": "Draft generated", "id": feed_id}


# -------------------------
# Draft API
# -------------------------

@app.get("/drafts")
def get_drafts(db: Session = Depends(get_db)):
    drafts = db.query(Draft).order_by(Draft.id.desc()).all()
    return [
        {
            "id": draft.id,
            "title": draft.title,
            "content": draft.content,
            "status": draft.status
        }
        for draft in drafts
    ]


# -------------------------
# Approve Draft
# -------------------------

@app.post("/approve-draft/{draft_id}")
def approve_draft(draft_id: int, db: Session = Depends(get_db)):
    draft = db.query(Draft).filter(
        Draft.id == draft_id
    ).first()

    if not draft:
        raise HTTPException(
            status_code=404,
            detail="Draft not found"
        )

    draft.status = "approved"

    platforms = [
        "linkedin",
        "instagram",
        "facebook",
        "x"
    ]

    for platform in platforms:
        queue = PublishingQueue(
            draft_id=draft.id,
            platform=platform
        )
        db.add(queue)

    db.commit()

    return {"message": "Draft approved and queued", "id": draft_id}


# -------------------------
# Reject Draft
# -------------------------

@app.post("/reject-draft/{draft_id}")
def reject_draft(draft_id: int, db: Session = Depends(get_db)):
    draft = db.query(Draft).filter(
        Draft.id == draft_id
    ).first()

    if not draft:
        raise HTTPException(
            status_code=404,
            detail="Draft not found"
        )

    draft.status = "rejected"
    db.commit()

    return {"message": "Draft rejected", "id": draft_id}


# -------------------------
# Publishing Queue API
# -------------------------

@app.get("/publishing-queue")
def publishing_queue(db: Session = Depends(get_db)):
    queue = db.query(PublishingQueue).order_by(
        PublishingQueue.id.desc()
    ).all()

    return [
        {
            "id": q.id,
            "draft_id": q.draft_id,
            "platform": q.platform,
            "status": q.status
        }
        for q in queue
    ]


# -------------------------
# Publish
# -------------------------

@app.post("/publish/{queue_id}")
def publish(queue_id: int):
    success = publish_post(queue_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Queue item not found"
        )

    return {"message": "Published", "id": queue_id}