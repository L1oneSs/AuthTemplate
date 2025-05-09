"""
Скрипт запуска приложения в production режиме
"""
import os
import multiprocessing
from gunicorn.app.base import BaseApplication
from app import create_app

class GunicornApplication(BaseApplication):
    """Класс для настройки и запуска Gunicorn"""
    
    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        super().__init__()

    def load_config(self):
        """Загрузка конфигурации Gunicorn"""
        for key, value in self.options.items():
            if key in self.cfg.settings and value is not None:
                self.cfg.set(key.lower(), value)

    def load(self):
        """Загрузка WSGI приложения"""
        return self.application

if __name__ == '__main__':
    # Установка переменных окружения для production
    os.environ['FLASK_ENV'] = 'production'
    os.environ['FLASK_DEBUG'] = '0'
    
    # Создание экземпляра приложения
    app = create_app('production')
    
    # Настройки Gunicorn
    options = {
        'bind': '0.0.0.0:7020',
        'workers': multiprocessing.cpu_count() * 2 + 1,
        'worker_class': 'sync',
        'timeout': 120,
        'keepalive': 5,
        'max_requests': 1000,
        'max_requests_jitter': 50,
        'accesslog': 'logs/access.log',
        'errorlog': 'logs/error.log',
        'loglevel': 'info',
        'capture_output': True,
        'enable_stdio_inheritance': True,
        'preload_app': True
    }
    
    # Создание директории для логов
    os.makedirs('logs', exist_ok=True)
    
    # Запуск приложения через Gunicorn
    GunicornApplication(app, options).run()
