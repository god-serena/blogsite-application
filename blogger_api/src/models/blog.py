# https://docs.sqlalchemy.org/en/13/orm/basic_relationships.html
from src.db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime 
from sqlalchemy.sql import func
from typing import Optional

class Blog(db.Model):
    __tablename__ = 'blog'
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[int] = mapped_column(db.String(25))
    author_id: Mapped[int] = mapped_column(
        db.Integer,
        db.ForeignKey("author.id")
    )
    banner: Mapped[dict] = mapped_column(db.JSON())
    body: Mapped[dict] = mapped_column(db.JSON())
    published_at: Mapped[datetime] = mapped_column(
        db.DateTime(timezone=True),
        insert_default=func.now()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        db.DateTime(timezone=True),
        onupdate=func.now()
    )