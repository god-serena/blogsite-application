# https://medium.com/@sujathamudadla1213/responses-in-flask-a80a3c1605fb
# https://www.youtube.com/watch?v=OLsVfmjEpSc
# https://flask-sqlalchemy.readthedocs.io/en/stable/quickstart/
# https://docs.sqlalchemy.org/en/20/orm/session_transaction.html
# https://docs.sqlalchemy.org/en/20/orm/session_basics.html#framing-out-a-begin-commit-rollback-block
from models.user import UserProfile, Author, Reader
from flask import Blueprint, request, make_response
from auth import auth_required, generate_access_token
from werkzeug.security import check_password_hash, generate_password_hash
from src.db import db
from sqlalchemy import select

user_route = Blueprint('user_route',__name__)

@user_route.route("/sign-up", methods=["POST"])
def sign_up_user():
    payload = request.json
    email = payload.get("email")
    first_name = payload.get("first_name")
    last_name = payload.get("last_name")
    password = payload.pop("password")
    role = payload.pop("role", None)

    try:
        exists = db.session.execute(
            select(UserProfile)\
            .where(UserProfile.email==email)
        ).scalar_one_or_none()
        
        if exists:
            return make_response(
                { "message": "Email is already taken." },
                400
            )
        user_name = f"{first_name}.{last_name}".lower()
        new_user = UserProfile(
            email=email,
            first_name=first_name,
            last_name=last_name,
            user_name=user_name,
            password=generate_password_hash(password)
        )

        db.session.add(new_user)
        db.session.commit()

        if role == "author":
            author = Author(user_profile_id=new_user.id)
            db.session.add(author)
        elif role == "reader":
            reader = Reader(user_profile_id=new_user.id)
            db.session.add(reader)
        else:
            raise ValueError("Invalid role.")
        
        db.session.commit()

        token = generate_access_token(data={"user": new_user})
        return make_response(
            {
                "access_token": token,
                "user": {
                    "id": new_user.id,
                    "email": new_user.email,
                    "full_name": new_user.full_name,
                    "user_name": new_user.user_name,
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

@user_route.route("/sign-in", methods=["POST"])
def sign_in_user():
    payload = request.json
    email = payload.get("email")
    password = payload.get("password")

    try:
        user = db.session.execute(
            select(UserProfile)\
            .where(UserProfile.email==email)
        ).scalar_one_or_none()
        if not user or check_password_hash(user.password, password):
            return make_response(
                { "message": "Invalid credentials."},
                400
            )
        token = generate_access_token(data={"user": user})
        return make_response(
            {
                "access_token": token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "user_name": user.user_name,
                }
            },
            200
        )
    except Exception as e:
        return make_response({
            { "message": str(e) },
            500
        })


@user_route.route("/me")
@auth_required
def get_current_user():
    user = request.user
    return make_response({
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "user_name": user.user_name,
        }
    })
    