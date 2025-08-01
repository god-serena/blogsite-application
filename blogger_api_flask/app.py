# https://flask.palletsprojects.com/en/stable/tutorial/factory/
import os
import sys
from flask import Flask
from flasgger import Swagger
from flask_migrate import Migrate
from flask_cors import CORS

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from src.db import db
from src.blueprints import blogger_api

def create_app():
    app = Flask(__name__)
    app.config.from_object('src.configs.Config')

    db.init_app(app)

    Migrate(app, db)

    app.register_blueprint(blogger_api, url_prefix="/blogger-api")

    Swagger(app)
    CORS(app)

    return app