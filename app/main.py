from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates

from app.database import SessionLocal
from app.models import Feed, Draft
from app.content_agent import generate_blog
from app.feed_collector import collect_feeds
from app.feed_collector import collect_feeds
from app.models import Feed, Draft, PublishingQueue

app = FastAPI()

templates = Jinja2Templates(
    directory="app/templates"
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
# Feed API
# -------------------------

@app.get("/feeds")
def get_feeds():

    db = SessionLocal()

    feeds = db.query(Feed).all()

    return [
        {
            "id": feed.id,
            "title": feed.title,
            "status": feed.status
        }
        for feed in feeds
    ]


# -------------------------
# Dashboard
# -------------------------

@app.get("/dashboard")
def dashboard(request: Request):

    db = SessionLocal()

    feeds = db.query(Feed).all()

    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={
            "feeds": feeds
        }
    )


# -------------------------
# Approve Feed
# -------------------------

@app.post("/approve/{feed_id}")
def approve(feed_id: int):

    db = SessionLocal()

    feed = db.query(Feed).filter(
        Feed.id == feed_id
    ).first()

    if feed:
        feed.status = "approved"
        db.commit()

    return RedirectResponse(
        "/dashboard",
        status_code=303
    )


# -------------------------
# Reject Feed
# -------------------------

@app.post("/reject/{feed_id}")
def reject(feed_id: int):

    db = SessionLocal()

    feed = db.query(Feed).filter(
        Feed.id == feed_id
    ).first()

    if feed:
        feed.status = "rejected"
        db.commit()

    return RedirectResponse(
        "/dashboard",
        status_code=303
    )


# -------------------------
# Generate Blog
# -------------------------

@app.get("/generate/{feed_id}")
def generate(feed_id: int):

    db = SessionLocal()

    feed = db.query(Feed).filter(
        Feed.id == feed_id
    ).first()

    if not feed:
        return {
            "error": "Feed not found"
        }

    content = generate_blog(
        feed.title,
        feed.summary
    )

    draft = Draft(
        feed_id=feed.id,
        title=feed.title,
        content=content
    )

    db.add(draft)

    feed.status = "generated"

    db.commit()

    return {
        "message": "draft generated"
    }


# -------------------------
# Draft API
# -------------------------

@app.get("/drafts")
def get_drafts():

    db = SessionLocal()

    drafts = db.query(Draft).all()

    return [
        {
            "id": draft.id,
            "title": draft.title,
            "status": draft.status
        }
        for draft in drafts
    ]


# -------------------------
# Draft Dashboard
# -------------------------

@app.get("/draft-dashboard")
def draft_dashboard(request: Request):

    db = SessionLocal()

    drafts = db.query(Draft).all()

    return templates.TemplateResponse(
        request=request,
        name="drafts.html",
        context={
            "drafts": drafts
        }
    )
@app.post("/approve-draft/{draft_id}")
def approve_draft(draft_id: int):

    db = SessionLocal()

    draft = db.query(Draft).filter(
        Draft.id == draft_id
    ).first()

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

    return RedirectResponse(
        "/draft-dashboard",
        status_code=303
    )

@app.post("/reject-draft/{draft_id}")
def reject_draft(draft_id: int):

    db = SessionLocal()

    draft = db.query(Draft).filter(
        Draft.id == draft_id
    ).first()

    draft.status = "rejected"

    db.commit()

    return RedirectResponse(
        "/draft-dashboard",
        status_code=303
    )
@app.get("/publishing-queue")
def publishing_queue():

    db = SessionLocal()

    queue = db.query(
        PublishingQueue
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
from app.social_agent import publish_post

@app.post("/publish/{queue_id}")
def publish(queue_id: int):

    publish_post(queue_id)

    return {
        "message": "published"
    }