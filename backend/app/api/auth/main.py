"""
Основной модуль API аутентификации, объединяющий все эндпоинты
"""
from app.api.auth import api
from app.api.auth.auth import Login, Logout, RefreshToken
from app.api.auth.users import Register, UserProfile, UserSessions, UserSessionDetail, UserAvatar
from app.api.auth.password import SetPassword, ResetPassword, SendPasswordEmail

# Регистрация всех ресурсов API аутентификации
