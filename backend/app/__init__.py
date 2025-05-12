"""
Инициализация Flask приложения
"""
import os
import logging
from flask import Flask, jsonify
from marshmallow import ValidationError
from app.extensions import init_extensions
from app.schemas.base import ErrorSchema
from config import config
from app.commands import register_commands

# Создаем директорию для логов, если она не существует
os.makedirs('logs', exist_ok=True)

# Настройка логирования
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger('app')

# Глобальный экземпляр приложения
app = None

class YourApp:
    """
    Класс для управления Flask приложением
    """
    _instance = None
    
    def __new__(cls, config_name=None):
        """
        Реализация паттерна Singleton
        """
        if cls._instance is None:
            cls._instance = super(YourApp, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self, config_name=None):
        """
        Инициализация приложения
        :param config_name: имя конфигурации (development/production)
        """
        if self._initialized:
            return
        
        self.app = Flask(__name__)
        self.app.config.from_object(config[config_name])
        
        # Устанавливаем глобальный экземпляр приложения
        global app
        app = self.app
        
        # Инициализация расширений
        init_extensions(self.app)
        
        # Настройка JWT
        self.app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
        self.app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1 hour
        self.app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 2592000  # 30 days
        self.app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Отключаем CSRF защиту для куки
        
        # Регистрация обработчиков ошибок
        self._register_error_handlers()
        
        # Регистрация маршрутов API
        self._register_api_routes()

        # Регистрация команд Flask CLI
        register_commands(self.app)
        
        # Создание всех таблиц после инициализации всех компонентов и импорта моделей
        with self.app.app_context():
            from app.extensions import db
            # from app.helpers.create_default_roles import create_default_roles
            
            db.create_all()
            # Автоматически создаем роли (отключите, если не нужно)
            # create_default_roles()
            logger.info("База данных успешно инициализирована")
        
        # Устанавливаем флаг инициализации
        self._initialized = True
        
        logger.info("YourApp успешно инициализирован")
    
    def _register_error_handlers(self):
        """
        Регистрация обработчиков ошибок
        """
        @self.app.errorhandler(ValidationError)
        def handle_validation_error(error):
            """Обработка ошибок валидации схем"""
            response = ErrorSchema().dump({
                'message': 'Ошибка валидации данных',
                'errors': error.messages,
                'status_code': 400
            })
            return jsonify(response), 400

        @self.app.errorhandler(401)
        def handle_unauthorized_error(error):
            """Обработка ошибок авторизации"""
            response = ErrorSchema().dump({
                'message': 'Необходима авторизация',
                'status_code': 401
            })
            return jsonify(response), 401

        @self.app.errorhandler(403)
        def handle_forbidden_error(error):
            """Обработка ошибок доступа"""
            response = ErrorSchema().dump({
                'message': 'Недостаточно прав для выполнения операции',
                'status_code': 403
            })
            return jsonify(response), 403

        @self.app.errorhandler(404)
        def handle_not_found_error(error):
            """Обработка ошибок отсутствия ресурса"""
            response = ErrorSchema().dump({
                'message': 'Запрашиваемый ресурс не найден',
                'status_code': 404
            })
            return jsonify(response), 404

        @self.app.errorhandler(405)
        def handle_method_not_allowed_error(error):
            """Обработка ошибок недоступности метода"""
            response = ErrorSchema().dump({
                'message': 'Метод не поддерживается для данного ресурса',
                'status_code': 405
            })
            return jsonify(response), 405

        @self.app.errorhandler(500)
        def handle_internal_server_error(error):
            """Обработка внутренних ошибок сервера"""
            response = ErrorSchema().dump({
                'message': 'Внутренняя ошибка сервера',
                'status_code': 500
            })
            return jsonify(response), 500
    
    def _register_api_routes(self):
        """
        Регистрация маршрутов API
        """
        from app.extensions import api
        
        # Импорт API namespaces после инициализации api
        from app.api.auth import api as auth_api

        # Регистрация namespaces без префикса /api, так как он уже добавлен в Api
        api.add_namespace(auth_api, path='/auth')

    
    def get_app(self):
        """
        Получение экземпляра Flask приложения
        :return: экземпляр Flask приложения
        """
        return self.app

def create_app(config_name=None):
    """
    Фабрика создания Flask приложения
    :param config_name: имя конфигурации (development/production)
    :return: экземпляр Flask приложения
    """
    your_app = YourApp(config_name)
    return your_app.get_app()
