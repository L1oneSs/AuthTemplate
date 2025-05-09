"""
API для установки и сброса пароля пользователей
"""
import logging
from flask import request, current_app
from flask_restx import Resource, fields
from marshmallow import ValidationError, Schema, fields as ma_fields
from app.models.auth import User
from app.utils.email import decode_token, send_password_set_email
from app.extensions import db
from app.api.auth import api

logger = logging.getLogger(__name__)

# Модели для Swagger документации
token_model = api.model('PasswordToken', {
    'token': fields.String(required=True, description='Токен для установки/сброса пароля')
})

password_set_model = api.model('PasswordSet', {
    'token': fields.String(required=True, description='Токен для установки/сброса пароля'),
    'password': fields.String(required=True, description='Новый пароль'),
    'confirm_password': fields.String(required=True, description='Подтверждение нового пароля')
})

reset_request_model = api.model('PasswordResetRequest', {
    'email': fields.String(required=True, description='Email пользователя')
})

send_email_model = api.model('SendPasswordEmail', {
    'email': fields.String(required=True, description='Email пользователя'),
    'email_type': fields.String(required=True, description='Тип письма (reset_password)'),
})

# Схемы для валидации
class PasswordSetSchema(Schema):
    token = ma_fields.String(required=True)
    password = ma_fields.String(required=True)
    confirm_password = ma_fields.String(required=True)

class PasswordResetRequestSchema(Schema):
    email = ma_fields.Email(required=True)

class SendEmailSchema(Schema):
    email = ma_fields.Email(required=True)
    email_type = ma_fields.String(required=True)

@api.route('/set-password')
class SetPassword(Resource):
    """Установка пароля пользователя по токену"""
    
    @api.doc(params={'token': 'Токен для установки пароля'})
    def get(self):
        """Проверка валидности токена для установки пароля"""
        token = request.args.get('token')
        if not token:
            return {'message': 'Токен не предоставлен'}, 400
        
        # Декодируем токен
        token_data = decode_token(token)
        if not token_data or 'id' not in token_data or 'key' not in token_data:
            return {'message': 'Недействительный токен'}, 400
        
        # Проверяем существование пользователя
        user = User.query.get(token_data['id'])
        if not user:
            return {'message': 'Пользователь не найден'}, 404
        
        return {
            'message': 'Токен действителен',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }
    
    @api.expect(password_set_model)
    def post(self):
        """Установка нового пароля по токену"""
        try:
            data = PasswordSetSchema().load(request.json)
            
            # Проверка совпадения паролей
            if data['password'] != data['confirm_password']:
                return {'message': 'Пароли не совпадают'}, 400
            
            # Декодируем токен
            token_data = decode_token(data['token'])
            if not token_data or 'id' not in token_data or 'key' not in token_data:
                return {'message': 'Недействительный токен'}, 400
            
            # Находим пользователя
            user = User.query.get(token_data['id'])
            if not user:
                return {'message': 'Пользователь не найден'}, 404
            
            # Устанавливаем новый пароль
            user.set_password(data['password'])
            db.session.commit()
            
            return {'message': 'Пароль успешно установлен'}
            
        except ValidationError as e:
            return {'message': 'Ошибка валидации', 'errors': e.messages}, 400

@api.route('/send-email')
class SendPasswordEmail(Resource):
    """Отправка email для сброса пароля"""
    
    @api.expect(send_email_model)
    def post(self):
        """Отправка email для сброса пароля"""
        try:
            data = SendEmailSchema().load(request.json)
            
            # Проверяем тип письма
            email_type = data['email_type'].lower()
            if email_type != 'reset_password':
                return {'message': 'Неподдерживаемый тип письма. Поддерживается только reset_password'}, 400
            
            # Находим пользователя по email
            user = User.query.filter_by(email=data['email']).first()
            if not user:
                # Для безопасности не сообщаем, что пользователь не найден
                return {'message': 'Если указанный email зарегистрирован в системе, на него будет отправлена инструкция по сбросу пароля'}, 200
            
            # Формируем полное имя пользователя
            full_name = f"{user.last_name or ''} {user.first_name or ''} {user.patronymic or ''}".strip()
            if not full_name:
                full_name = user.username
            
            # Отправляем письмо для сброса пароля
            success = send_password_set_email(
                user_email=user.email,
                user_name=full_name,
                user_id=user.id,
                is_reset=True
            )
            
            if success:
                return {'message': 'Если указанный email зарегистрирован в системе, на него будет отправлена инструкция по сбросу пароля'}, 200
            else:
                return {
                    'message': 'Ошибка отправки письма. Проверьте настройки SMTP сервера.',
                    'success': False
                }, 500
            
        except ValidationError as e:
            return {'message': 'Ошибка валидации', 'errors': e.messages}, 400

@api.route('/reset-password')
class ResetPassword(Resource):
    """Сброс пароля пользователя"""
    
    @api.doc(params={'token': 'Токен для сброса пароля'})
    def get(self):
        """Проверка валидности токена для сброса пароля"""
        token = request.args.get('token')
        if not token:
            return {'message': 'Токен не предоставлен'}, 400
        
        # Декодируем токен
        token_data = decode_token(token)
        if not token_data or 'id' not in token_data or 'key' not in token_data:
            return {'message': 'Недействительный токен'}, 400
        
        # Проверяем существование пользователя
        user = User.query.get(token_data['id'])
        if not user:
            return {'message': 'Пользователь не найден'}, 404
        
        return {
            'message': 'Токен действителен',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }
    
    @api.expect(reset_request_model)
    def post(self):
        """Запрос на сброс пароля"""
        try:
            data = PasswordResetRequestSchema().load(request.json)
            
            # Находим пользователя по email
            user = User.query.filter_by(email=data['email']).first()
            if not user:
                # Для безопасности не сообщаем, что пользователь не найден
                return {'message': 'Если указанный email зарегистрирован в системе, на него будет отправлена инструкция по сбросу пароля'}, 200
            
            # Отправляем письмо для сброса пароля
            full_name = f"{user.last_name or ''} {user.first_name or ''} {user.patronymic or ''}".strip()
            if not full_name:
                full_name = user.username
                
            # Отправляем письмо для сброса пароля
            logger.info(f"Отправка письма для сброса пароля пользователю {user.id} ({user.email})")
            email_sent = send_password_set_email(
                user_email=user.email,
                user_name=full_name,
                user_id=user.id,
                is_reset=True
            )
            
            if not email_sent:
                logger.warning(f"Не удалось отправить письмо для сброса пароля пользователю {user.id} ({user.email})")
            
            return {'message': 'Если указанный email зарегистрирован в системе, на него будет отправлена инструкция по сбросу пароля'}, 200
            
        except ValidationError as e:
            return {'message': 'Ошибка валидации', 'errors': e.messages}, 400
    
    @api.expect(password_set_model)
    def put(self):
        """Установка нового пароля после сброса"""
        try:
            data = PasswordSetSchema().load(request.json)
            
            # Проверка совпадения паролей
            if data['password'] != data['confirm_password']:
                return {'message': 'Пароли не совпадают'}, 400
            
            # Декодируем токен
            token_data = decode_token(data['token'])
            if not token_data or 'id' not in token_data or 'key' not in token_data:
                return {'message': 'Недействительный токен'}, 400
            
            # Находим пользователя
            user = User.query.get(token_data['id'])
            if not user:
                return {'message': 'Пользователь не найден'}, 404
            
            # Устанавливаем новый пароль
            user.set_password(data['password'])
            db.session.commit()
            
            return {'message': 'Пароль успешно изменен'}
            
        except ValidationError as e:
            return {'message': 'Ошибка валидации', 'errors': e.messages}, 400
