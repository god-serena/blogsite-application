# https://dev.to/hackersandslackers/configuring-your-flask-app-2246

import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "SQLALCHEMY_DATABASE_URI",
        "postgresql://user:password@blogger_db:5432/blogger_db"
    )
    DEBUG = os.getenv(
        "DEBUG",
        False
    )
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "blogger_api_dev"
    )
    ACCESS_TOKEN_LIFETIME = os.getenv(
        "ACCESS_TOKEN_LIFETIME",
        7
    )
