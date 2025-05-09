"""
API для управления пользователями
"""
from flask import request
from flask_restx import Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.models.auth import User
from app.schemas.auth import UserUpdateSchema, UserCreateSchema
from app.extensions import db
from app.api.auth import api

# Модели для Swagger документации
user_model = api.model('User', {
    'username': fields.String(required=False, description='Имя пользователя (опционально)'),
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Пароль'),
    'confirm_password': fields.String(required=True, description='Подтверждение пароля'),
    'first_name': fields.String(description='Имя'),
    'last_name': fields.String(description='Фамилия'),
    'patronymic': fields.String(description='Отчество'),
})

user_update_model = api.model('UserUpdate', {
    'username': fields.String(description='Имя пользователя (опционально)'),
    'email': fields.String(description='Email (опционально)'),
    'first_name': fields.String(description='Имя (опционально)'),
    'last_name': fields.String(description='Фамилия (опционально)'),
    'patronymic': fields.String(description='Отчество (опционально)'),
    'current_password': fields.String(description='Текущий пароль (обязателен при изменении пароля)'),
    'new_password': fields.String(description='Новый пароль (требует указания current_password и confirm_new_password)'),
    'confirm_new_password': fields.String(description='Подтверждение нового пароля (требует указания current_password и new_password)')
})

@api.route('/me')
class UserProfile(Resource):
    """Профиль пользователя"""
    
    @jwt_required()
    @api.doc(security='jwt')
    def get(self):
        """Получение данных текущего пользователя"""
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        
        # Проверяем, не удалена ли учетная запись
        if user.deleted:
            return {'message': 'Учетная запись удалена'}, 401
        
        return UserCreateSchema(exclude=['password']).dump(user)
    
    @jwt_required()
    @api.doc(security='jwt')
    @api.expect(user_update_model)
    def put(self):
        """Обновление данных пользователя"""
        try:
            user_id = get_jwt_identity()
            user = User.query.get_or_404(user_id)
            
            # Проверяем, не удалена ли учетная запись
            if user.deleted:
                return {'message': 'Учетная запись удалена'}, 401
            
            user_data = UserUpdateSchema().load(request.json)
            
            # Проверка текущего пароля при изменении
            if 'new_password' in user_data:
                if not user.check_password(user_data['current_password']):
                    return {'message': 'Неверный текущий пароль'}, 400
                user.set_password(user_data['new_password'])
            
            # Обновление остальных полей
            for field in ['username', 'email', 'first_name', 'last_name', 'patronymic', 'phone_number', 'birthday']:
                if field in user_data:
                    setattr(user, field, user_data[field])
            
            db.session.commit()
            
            return {
                'message': 'Профиль успешно обновлен',
                'user': UserCreateSchema(exclude=['password']).dump(user)
            }
            
        except ValidationError as e:
            return {'message': 'Ошибка валидации', 'errors': e.messages}, 400

@api.route('/sessions')
class UserSessions(Resource):
    """Управление сессиями пользователя"""
    
    @jwt_required()
    @api.doc(security='jwt')
    def get(self):
        """Получение списка активных сессий пользователя"""
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        
        # Проверяем, не удалена ли учетная запись
        if user.deleted:
            return {'message': 'Учетная запись удалена'}, 401
        
        # Получаем активные сессии пользователя
        from app.schemas.auth import UserSessionSchema
        sessions = user.sessions
        active_sessions = [s for s in sessions if s.is_active]
        
        return {
            'message': 'Список активных сессий',
            'sessions': UserSessionSchema(many=True).dump(active_sessions)
        }
    
    @jwt_required()
    @api.doc(security='jwt')
    def delete(self):
        """Завершение всех сессий пользователя, кроме текущей"""
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        
        # Проверяем, не удалена ли учетная запись
        if user.deleted:
            return {'message': 'Учетная запись удалена'}, 401
        
        # Получаем текущий refresh_token
        current_refresh_token = request.json.get('refresh_token')
        
        # Деактивируем все сессии, кроме текущей
        for session in user.sessions:
            if session.refresh_token != current_refresh_token:
                session.is_active = False
        
        db.session.commit()
        
        return {'message': 'Все другие сессии успешно завершены'}

@api.route('/sessions/<int:session_id>')
class UserSessionDetail(Resource):
    """Управление конкретной сессией пользователя"""
    
    @jwt_required()
    @api.doc(security='jwt')
    def delete(self, session_id):
        """Завершение конкретной сессии пользователя"""
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        
        # Проверяем, не удалена ли учетная запись
        if user.deleted:
            return {'message': 'Учетная запись удалена'}, 401
        
        # Находим сессию
        from app.models.auth import UserSession
        session = UserSession.query.get_or_404(session_id)
        
        # Проверяем, принадлежит ли сессия пользователю
        if session.user_id != user.id:
            return {'message': 'Доступ запрещен'}, 403
        
        # Деактивируем сессию
        session.is_active = False
        db.session.commit()
        
        return {'message': 'Сессия успешно завершена'}


