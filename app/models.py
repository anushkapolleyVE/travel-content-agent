from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Feed(Base):

    __tablename__ = "feeds"

    id = Column(Integer, primary_key=True)

    title = Column(String)
    link = Column(String, unique=True)

    summary = Column(String)

    status = Column(
        String,
        default="pending"
    )

class Draft(Base):

    __tablename__ = "drafts"

    id = Column(Integer, primary_key=True)

    feed_id = Column(Integer)

    title = Column(String)

    content = Column(String)

    status = Column(
        String,
        default="pending"
    )
class PublishingQueue(Base):

    __tablename__ = "publishing_queue"

    id = Column(Integer, primary_key=True)

    draft_id = Column(Integer)

    platform = Column(String)

    status = Column(
        String,
        default="pending"
    )
class AgentLog(Base):

    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True)

    agent = Column(String)

    action = Column(String)

    result = Column(String)