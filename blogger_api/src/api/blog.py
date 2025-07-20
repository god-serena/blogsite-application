# https://medium.com/@sujathamudadla1213/responses-in-flask-a80a3c1605fb
# https://www.youtube.com/watch?v=OLsVfmjEpSc
# https://flask-sqlalchemy.readthedocs.io/en/stable/quickstart/
# https://docs.sqlalchemy.org/en/20/orm/session_transaction.html
# https://docs.sqlalchemy.org/en/20/orm/session_basics.html#framing-out-a-begin-commit-rollback-block
from flask import Blueprint, request, make_response
from src.db import db
from auth import auth_required
from models.blog import Blog
from models.user import UserProfile
from api.utils import instance_to_dict
from sqlalchemy import select

blog_route = Blueprint("blog_route", __name__)


@blog_route.route("/")
def get_blogs():
    query_size = 5
    title = request.args.get("title")
    head_index = request.args.get("top")

    try:
        blogs = []
        if title:
            blogs = db.session.execute(
                select(Blog)\
                .where(Blog.title.like(f"%{title}%"))
                .offset(head_index)
                .limit(query_size)
            ).scalars().all()
        else:
            blogs = db.session.execute(
                select(Blog)
                .offset(head_index)
                .limit(query_size)
            ).scalars().all()

        return make_response(
            { 
                "blogs": [
                    instance_to_dict(blog_obj) for blog_obj in blogs
                ]
            },
            200
        )
    except Exception as e:
        return make_response(
            { "message": str(e) },
            500
        )

@blog_route.route("/<int:id>")
def get_blog(id):
    try:
        blog = db.session.get(Blog, id)
        author_profile = db.session.execute(
            select(UserProfile)\
            .where(UserProfile.id==blog.author.user_profile_id)
        ).scalar_one_or_none()

        return make_response(
            {
                "blog": {
                    **instance_to_dict(blog),
                },
                "author": {
                    **instance_to_dict(
                        author_profile,
                        selected=("full_name", "avatar_url")
                    )
                }
            },
            200
        )
    except Exception as e:
        return make_response(
            { "message": str(e) },
            500
        )

@blog_route.route("/create", methods=["POST"])
@auth_required
def create_blog():
    payload = request.json
    try:
        existing = db.session.execute(
            select(Blog)\
            .where(Blog.title==payload.get('title'))
        ).scalar_one_or_none()
        if existing:
            return make_response(
                { "message": "Blog already exists." },
                400
            )
        author_id = request.user.author.id
        new_blog = Blog(
            **payload,
            author_id=author_id
        )

        db.session.add(new_blog)
        db.session.commit()

        return make_response(
            {
                "blog": {
                    **instance_to_dict(new_blog)
                }
            },
            201
        )
    except Exception as e:
        db.session.rollback()
        return make_response(
            { "message": str(e) },
            500
        )


@blog_route.route("/update/<int:id>", methods=["PATCH"])
@auth_required
def update_blog(id):
    payload = request.json
    try:
        blog = db.session.get(Blog, id)

        for key, value in payload.items():
            if hasattr(blog, key):
                setattr(blog, key, value)
        
        db.session.commit()

        return make_response(
            {
                "message": "Blog updated",
                "blog": { **instance_to_dict(blog) }
            },
            200
        )
    except Exception as e:
        db.session.rollback()
        return make_response(
            { "message": str(e) },
            500
        )


@blog_route.route("/delete/<int:id>", methods=["DELETE"])
@auth_required
def delete_blog(id):
    payload = request.json
    try:
        blog = db.session.get(Blog, id)
        
        db.session.delete(blog)
        db.session.commit()

        return make_response(
            { "message": "Blog updated" },
            200
        )
    except Exception as e:
        db.session.rollback()
        return make_response(
            { "message": str(e) },
            500
        )
