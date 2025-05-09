"""
Конфигурационный файл приложения.
Содержит различные настройки для разных окружений (development, production).
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Загрузка переменных окружения из .env файла
load_dotenv()
print(f"DEV_DATABASE_URL: {os.environ.get('DEV_DATABASE_URL')}")


class Config:
    """Базовый класс конфигурации"""
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    
    # Обрабатываем список локаций через запятую
    jwt_locations_str = os.environ.get('JWT_TOKEN_LOCATION', 'headers,cookies')
    JWT_TOKEN_LOCATION = jwt_locations_str.split(',')
    
    # Конвертируем строковые значения в соответствующие типы
    JWT_COOKIE_CSRF_PROTECT = os.environ.get('JWT_COOKIE_CSRF_PROTECT', 'False').lower() == 'true'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 3600)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(seconds=int(os.environ.get('JWT_REFRESH_TOKEN_EXPIRES', 2592000)))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Настройки для отправки email
    SMTP_SERVER = os.environ.get('SMTP_SERVER')
    SMTP_PORT = int(os.environ.get('SMTP_PORT', 465))
    SMTP_USERNAME = os.environ.get('SMTP_USERNAME')
    SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD')
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
    FRONTEND_URL = os.environ.get('FRONTEND_URL')
    
    # Настройки для токенов
    TOKEN_SALT = os.environ.get('TOKEN_SALT')
    TOKEN_LIFETIME = int(os.environ.get('TOKEN_LIFETIME', 86400))

class DevelopmentConfig(Config):
    """Конфигурация для разработки"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL')

class ProductionConfig(Config):
    """Конфигурация для продакшена"""
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}