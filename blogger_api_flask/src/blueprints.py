from flask import Blueprint
from api.user import user_route
from api.blog import blog_route

blogger_api = Blueprint('blogger-api',__name__)
blogger_api.register_blueprint(user_route, url_prefix="/user")
blogger_api.register_blueprint(blog_route, url_prefix="/blog")