"""
Скрипт запуска приложения в production режиме для Windows
"""
import os
import logging
import multiprocessing
from waitress import serve
from app import create_app
from dotenv import load_dotenv

class WaitressApplication:
    """Класс для настройки и запуска Waitress"""
    
    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        
    def setup_logging(self):
        """Настройка логирования"""
        log_dir = os.path.dirname(self.options.get('accesslog', 'logs/access.log'))
        os.makedirs(log_dir, exist_ok=True)
        
        # Настройка логирования для access.log
        access_logger = logging.getLogger('waitress.access')
        access_handler = logging.FileHandler(self.options.get('accesslog', 'logs/access.log'))
        access_logger.addHandler(access_handler)
        access_logger.setLevel(logging.INFO)
        
        # Настройка логирования для error.log
        error_logger = logging.getLogger('waitress.error')
        error_handler = logging.FileHandler(self.options.get('errorlog', 'logs/error.log'))
        error_logger.addHandler(error_handler)
        error_logger.setLevel(logging.INFO)
        
        # Настройка вывода в консоль
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
        console_handler.setFormatter(formatter)
        access_logger.addHandler(console_handler)
        error_logger.addHandler(console_handler)

    def run(self):
        """Запуск приложения через Waitress"""
        self.setup_logging()
        
        # Извлечение хоста и порта из строки bind
        bind = self.options.get('bind', '0.0.0.0:7020')
        if ':' in bind:
            host, port = bind.split(':')
            port = int(port)
        else:
            host, port = bind, 7020
        
        print(f"Запуск сервера на http://{host}:{port}")
        print(f"Количество потоков: {self.options.get('workers', 4)}")
        
        # Запуск приложения через Waitress
        serve(
            self.application,
            host=host,
            port=port,
            threads=self.options.get('workers', 4),
            connection_limit=self.options.get('max_requests', 1000),
            channel_timeout=self.options.get('timeout', 120),
            cleanup_interval=30,
            url_scheme='http'
        )

if __name__ == '__main__':
    # Загрузка переменных окружения
    load_dotenv()
    
    # Установка переменных окружения для production
    os.environ['FLASK_ENV'] = 'production'
    os.environ['FLASK_DEBUG'] = '0'
    
    # Создание экземпляра приложения
    app = create_app('production')
    
    # Настройки (аналогично Gunicorn)
    options = {
        'bind': '0.0.0.0:7020',
        'workers': multiprocessing.cpu_count() * 2 + 1,
        'timeout': 120,
        'max_requests': 1000,
        'accesslog': 'logs/access.log',
        'errorlog': 'logs/error.log',
        'loglevel': 'info',
        'capture_output': True,
    }
    
    # Создание директории для логов
    os.makedirs('logs', exist_ok=True)
    
    # Запуск приложения через Waitress
    WaitressApplication(app, options).run()