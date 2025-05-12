"""
Утилиты для аутентификации и авторизации
"""
from functools import wraps
from datetime import datetime, timezone
from flask import request, current_app, jsonify
from flask_jwt_extended import (
    verify_jwt_in_request, get_jwt_identity,
    create_access_token, create_refresh_token,
    set_access_cookies, set_refresh_cookies,
    unset_jwt_cookies
)
from app.models.auth import User, UserSession
from app.extensions import db

def get_user_by_identity(identity):
    """
    Получение пользователя по идентификатору из JWT
    :param identity: идентификатор пользователя
    :return: объект пользователя или None
    """
    return User.query.get(identity)


def clear_auth_cookies(response):
    """
    Очистка JWT токенов из кук
    :param response: объект ответа Flask
    :return: модифицированный ответ
    """
    unset_jwt_cookies(response)
    return response

def role_required(role_name):
    """
    Декоратор для проверки наличия роли у пользователя
    :param role_name: название роли
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user = get_user_by_identity(get_jwt_identity())
            
            if not user:
                return {
                    'message': 'Пользователь не найден',
                    'status_code': 401
                }, 401
            
            if not user.is_active:
                return {
                    'message': 'Пользователь деактивирован',
                    'status_code': 403
                }, 403
            
            if not any(role.name == role_name for role in user.roles):
                return {
                    'message': 'Недостаточно прав для выполнения операции',
                    'status_code': 403
                }, 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator

