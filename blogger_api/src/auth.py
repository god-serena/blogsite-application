# https://www.youtube.com/watch?v=OLsVfmjEpSc
from functools import wraps
from flask import request, current_app, make_response
from models.user import UserProfile
import jwt
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm.exc import NoResultFound

def auth_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return make_response(
                { "message": "Invalid authorization header."},
                401
            )
        token = auth_header.split(" ")[1]
        try:
            payload = decode_token(token)
            user_id = payload.get("user_id")
            user = UserProfile.query.get(user_id)
            request.user = user
        except NoResultFound as e:
            return make_response(
                {"message": str(e)},
                404
            )
        except jwt.ExpiredSignatureError or jwt.InvalidTokenError as e:
            return make_response(
                {"message": str(e)},
                403
            )
        except Exception as e:
            return make_response(
                {"message": str(e)},
                400
            )
        return func(*args, **kwargs)

    return decorated

def generate_access_token(data):
    return jwt.encode(
        {
            "user_id": data["user"].id,
            "exp": datetime.now(timezone.utc)
            + timedelta(days=current_app.config.get("ACCESS_TOKEN_LIFETIME")),
            "iat": datetime.now(timezone.utc),
            "type": "access",
        },
        current_app.config.get("SECRET_KEY"),
        algorithm="HS256",
    )

def decode_token(token, verify_exp=True):
    return jwt.decode(
        token,
        current_app.config.get("SECRET_KEY"),
        algorithms="HS256",
        options={"verify_exp": verify_exp},
    )