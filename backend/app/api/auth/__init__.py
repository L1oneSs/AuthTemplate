"""
Пакет API для аутентификации и управления пользователями
"""
from flask_restx import Namespace

api = Namespace('auth', description='Операции аутентификации и управления пользователями', security='jwt')

# Импортируем все ресурсы
from app.api.auth.auth import *
from app.api.auth.users import *
from app.api.auth.password import *
