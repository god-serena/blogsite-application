# https://docs.sqlalchemy.org/en/13/orm/basic_relationships.html
from src.db import db
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List
from datetime import datetime
from sqlalchemy.sql import func
from models.blog import Blog


class UserProfile(db.Model):
    __tablename__ = "user_profile"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(db.String(25))
    last_name: Mapped[str] = mapped_column(db.String(25))
    user_name: Mapped[str] = mapped_column(db.String(25))
    email: Mapped[str] = mapped_column(
        db.String(50),
        unique=True
    )
    password: Mapped[str] = mapped_column(db.String(200))
    avatar_data: Mapped[Optional[dict]] = mapped_column(db.JSON())
    registered_at: Mapped[Optional[datetime]] = mapped_column(
        db.DateTime(timezone=True),
        insert_default=func.now()
    )
    
    author: Mapped[Optional["Author"]] = relationship(
        "Author",
        uselist=False,
        backref="user_profile"
    )
    reader: Mapped[Optional["Reader"]] = relationship(
        "Reader",
        uselist=False,
        backref="user_profile"
    )

    def __str__(self):
        return f"User: {self.full_name} ({self.id})"

    @hybrid_property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def avatar_url(self):
        return self.avatar_data.get("url") if self.avatar_data else None


class Author(db.Model):
    __tablename__ = "author"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_profile_id: Mapped[int] = mapped_column(
        db.Integer,
        db.ForeignKey("user_profile.id")
    )
    blogs: Mapped[List[Blog]]  = relationship(backref="author")


class Reader(db.Model):
    __tablename__ = "reader"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_profile_id: Mapped[int] = mapped_column(
        db.Integer,
        db.ForeignKey("user_profile.id")
    )