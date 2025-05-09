"""
Утилиты для отправки электронных писем
"""
import base64
import json
import smtplib
import logging
import hashlib
import time
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app, url_for

logger = logging.getLogger(__name__)

# Соль для хеширования, в реальном приложении должна храниться в конфигурации
DEFAULT_SALT = "Secret_Salt"
# Время жизни токена в секундах (24 часа по умолчанию)
TOKEN_LIFETIME = 86400

def generate_secure_key(user_id, timestamp=None, salt=None):
    """
    Генерирует защищенный ключ на основе ID пользователя, временной метки и соли
    
    Args:
        user_id (int): ID пользователя
        timestamp (int, optional): Временная метка (если не указана, используется текущее время)
        salt (str, optional): Соль для хеширования (если не указана, используется DEFAULT_SALT)
        
    Returns:
        str: Защищенный ключ
    """
    if timestamp is None:
        timestamp = int(time.time())
    
    if salt is None:
        salt = current_app.config.get('TOKEN_SALT', DEFAULT_SALT)
    
    # Создаем строку для хеширования
    data_to_hash = f"{user_id}:{timestamp}:{salt}"
    
    # Хешируем с использованием SHA-256
    hash_obj = hashlib.sha256(data_to_hash.encode('utf-8'))
    return hash_obj.hexdigest()

def encode_token(data, include_timestamp=True):
    """
    Кодирует данные в base64 токен с защитой от подделки
    
    Args:
        data (dict): Словарь с данными для кодирования
        include_timestamp (bool): Включать ли временную метку в токен
        
    Returns:
        str: Закодированный base64 токен
    """
    # Добавляем временную метку, если требуется
    if include_timestamp:
        data['timestamp'] = int(time.time())
    
    # Если в данных есть ID пользователя, добавляем защищенный ключ
    if 'id' in data:
        salt = current_app.config.get('TOKEN_SALT', DEFAULT_SALT)
        data['key'] = generate_secure_key(data['id'], data.get('timestamp'), salt)
    
    json_str = json.dumps(data)
    return base64.b64encode(json_str.encode('utf-8')).decode('utf-8')

def decode_token(token, verify_timestamp=True):
    """
    Декодирует base64 токен в данные и проверяет его валидность
    
    Args:
        token (str): Закодированный base64 токен
        verify_timestamp (bool): Проверять ли срок действия токена
        
    Returns:
        dict: Декодированные данные или None, если токен недействителен
    """
    try:
        # Декодируем токен
        json_str = base64.b64decode(token).decode('utf-8')
        data = json.loads(json_str)
        
        # Проверяем наличие необходимых полей
        if 'id' not in data or 'key' not in data:
            logger.error("Токен не содержит необходимых полей (id, key)")
            return None
        
        # Проверяем временную метку, если требуется
        if verify_timestamp and 'timestamp' in data:
            current_time = int(time.time())
            token_time = data['timestamp']
            token_lifetime = current_app.config.get('TOKEN_LIFETIME', TOKEN_LIFETIME)
            
            if current_time - token_time > token_lifetime:
                logger.error(f"Срок действия токена истек. Создан: {token_time}, текущее время: {current_time}")
                return None
        
        # Проверяем валидность ключа
        if 'id' in data and 'key' in data and 'timestamp' in data:
            expected_key = generate_secure_key(data['id'], data['timestamp'])
            if data['key'] != expected_key:
                logger.error("Недействительный ключ в токене")
                return None
        
        return data
    except Exception as e:
        logger.error(f"Ошибка декодирования токена: {str(e)}")
        return None

def send_email(to_email, subject, html_content, text_content=None, max_retries=1):
    """
    Отправляет электронное письмо с возможностью повторных попыток
    
    Args:
        to_email (str): Email получателя
        subject (str): Тема письма
        html_content (str): HTML содержимое письма
        text_content (str, optional): Текстовое содержимое письма (для клиентов без поддержки HTML)
        max_retries (int, optional): Максимальное количество попыток отправки
        
    Returns:
        bool: True если письмо успешно отправлено, иначе False
    """
    # Получаем настройки SMTP из конфигурации
    try:
        smtp_server = current_app.config.get('SMTP_SERVER')
        smtp_port = current_app.config.get('SMTP_PORT')
        smtp_username = current_app.config.get('SMTP_USERNAME')
        smtp_password = current_app.config.get('SMTP_PASSWORD')
        sender_email = current_app.config.get('SENDER_EMAIL', smtp_username)
        smtp_timeout = current_app.config.get('SMTP_TIMEOUT', 10)  # Увеличенный таймаут
        enable_email = current_app.config.get('ENABLE_EMAIL', True)
        
        # Проверяем наличие настроек SMTP
        if not all([smtp_server, smtp_port, smtp_username, smtp_password]):
            logger.error("Отсутствуют настройки SMTP в конфигурации")
            return False
        
        # Проверяем, включена ли отправка писем
        if not enable_email:
            logger.info(f"Отправка писем отключена. Письмо на {to_email} не отправлено.")
            return True  # Возвращаем True, чтобы не блокировать процесс
        
        # Создаем сообщение
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = to_email
        
        # Добавляем текстовую версию (если предоставлена)
        if text_content:
            msg.attach(MIMEText(text_content, 'plain'))
        
        # Добавляем HTML версию
        msg.attach(MIMEText(html_content, 'html'))
        
        # Для асинхронной отправки писем в фоновом режиме
        # Это предотвратит блокировку API запросов
        import threading
        from flask import copy_current_request_context
        
        @copy_current_request_context
        def send_email_async():
            try:
                # Отправляем письмо с повторными попытками
                for attempt in range(max_retries):
                    try:
                        # Используем SSL соединение вместо TLS, если порт 465
                        if smtp_port == 465:
                            with smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=smtp_timeout) as server:
                                server.login(smtp_username, smtp_password)
                                server.send_message(msg)
                        else:
                            with smtplib.SMTP(smtp_server, smtp_port, timeout=smtp_timeout) as server:
                                server.starttls()
                                server.login(smtp_username, smtp_password)
                                server.send_message(msg)
                        
                        logger.info(f"Письмо успешно отправлено на {to_email}")
                        return True
                    except (smtplib.SMTPException, TimeoutError, ConnectionError) as e:
                        logger.warning(f"Попытка {attempt+1}/{max_retries} отправки письма не удалась: {str(e)}")
                        if attempt == max_retries - 1:  # Последняя попытка
                            logger.error(f"Не удалось отправить письмо после {max_retries} попыток: {str(e)}")
                            return False
                        time.sleep(1)  # Пауза перед следующей попыткой
                
                return False
                
            except Exception as e:
                logger.error(f"Ошибка отправки письма: {str(e)}")
                return False
    
        # Запускаем отправку письма в отдельном потоке
        email_thread = threading.Thread(target=send_email_async)
        email_thread.daemon = True  # Поток будет завершен при завершении основного потока
        email_thread.start()
        
        # Возвращаем True, так как отправка происходит асинхронно
        # Это предотвратит блокировку API запросов
        return True
        
    except Exception as e:
        logger.error(f"Ошибка при подготовке к отправке письма: {str(e)}")
        return False

def send_password_set_email(user_email, user_name, user_id, is_reset=False, custom_token=None):
    """
    Отправляет письмо для установки или сброса пароля
    
    Args:
        user_email (str): Email пользователя
        user_name (str): Имя пользователя
        user_id (int): ID пользователя
        is_reset (bool): True если это сброс пароля, False если установка нового пароля
        custom_token (str, optional): Пользовательский токен, если не указан, будет создан новый
        
    Returns:
        bool: True если письмо успешно отправлено, иначе False
    """
    # Создаем токен, если он не предоставлен
    if not custom_token:
        # Создаем временную метку
        timestamp = int(time.time())
        
        # Получаем соль из конфигурации
        salt = current_app.config.get('TOKEN_SALT', DEFAULT_SALT)
        
        # Генерируем защищенный ключ
        secure_key = generate_secure_key(user_id, timestamp, salt)
        
        # Формируем данные токена
        token_data = {
            'id': int(user_id),
            'timestamp': timestamp,
            'key': secure_key,
            'action': 'reset_password' if is_reset else 'set_password'
        }
        
        # Кодируем токен без добавления timestamp, так как мы уже его добавили
        token = encode_token(token_data, include_timestamp=False)
    else:
        token = custom_token
    
    # Определяем тип операции (установка или сброс пароля)
    operation_type = 'reset-password' if is_reset else 'set-password'
    
    # Формируем URL для установки/сброса пароля
    base_url = current_app.config.get('FRONTEND_URL', '')
    password_url = f"{base_url}/api/auth/{operation_type}?token={token}"
    
    # Формируем тему письма
    subject = "Сброс пароля" if is_reset else "Установка пароля"
    
    # Формируем HTML содержимое письма
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; }}
            .button {{ display: inline-block; background-color: #007bff; color: white; 
                      padding: 10px 20px; text-decoration: none; border-radius: 5px; }}
            .footer {{ margin-top: 30px; font-size: 12px; color: #777; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>{'Сброс пароля' if is_reset else 'Установка пароля'}</h2>
            </div>
            <div class="content">
                <p>Здравствуйте, {user_name}!</p>
                <p>{'Вы запросили сброс пароля для вашей учетной записи.' if is_reset else 'Для вас была создана учетная запись в системе.'}</p>
                <p>Для {'сброса' if is_reset else 'установки'} пароля, пожалуйста, перейдите по ссылке ниже:</p>
                <p style="text-align: center;">
                    <a href="{password_url}" class="button">{'Сбросить пароль' if is_reset else 'Установить пароль'}</a>
                </p>
                <p>Или скопируйте и вставьте следующую ссылку в адресную строку браузера:</p>
                <p>{password_url}</p>
                <p>Если вы не запрашивали {'сброс пароля' if is_reset else 'создание учетной записи'}, пожалуйста, проигнорируйте это письмо.</p>
            </div>
            <div class="footer">
                <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Формируем текстовое содержимое письма
    text_content = f"""
    Здравствуйте, {user_name}!
    
    {'Вы запросили сброс пароля для вашей учетной записи.' if is_reset else 'Для вас была создана учетная запись в системе.'}
    
    Для {'сброса' if is_reset else 'установки'} пароля, пожалуйста, перейдите по следующей ссылке:
    {password_url}
    
    Если вы не запрашивали {'сброс пароля' if is_reset else 'создание учетной записи'}, пожалуйста, проигнорируйте это письмо.
    
    Это автоматическое сообщение, пожалуйста, не отвечайте на него.
    """
    
    # Отправляем письмо
    return send_email(user_email, subject, html_content, text_content)
