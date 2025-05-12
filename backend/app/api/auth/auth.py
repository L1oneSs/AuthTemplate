"""
API для аутентификации пользователей (вход, выход, обновление токенов)
"""
from datetime import datetime, timedelta
import flask
from flask import request, jsonify
from flask_restx import Resource, fields
from flask_jwt_extended import (
    jwt_required, get_jwt_identity,
    create_access_token, create_refresh_token
)
from marshmallow import ValidationError
from app.models.auth import User, UserSession, Role  # Добавляем импорт Role
from app.schemas.auth import (
    LoginSchema, UserCreateSchema
)
from app.utils.auth import (
    clear_auth_cookies
)
from app.extensions import db
from app.api.auth import api
import user_agents

# Модели для Swagger документации
login_model = api.model('Login', {
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Пароль'),
})

logout_model = api.model('Logout', {
    'refresh_token': fields.String(required=False, description='Refresh токен для деактивации конкретной сессии. Если не указан, будут деактивированы все сессии пользователя.')
})

# Модель для регистрации - только email и пароль
register_model = api.model('Register', {
    'email': fields.String(required=True, description='Email пользователя'),
    'username': fields.String(required=True, description='Имя пользователя'),
    'password': fields.String(required=True, description='Пароль'),
})

@api.route('/register')
class Register(Resource):
    """Регистрация в системе"""
    
    @api.expect(register_model)
    @api.response(201, 'Успешная регистрация')
    @api.response(400, 'Ошибка валидации')
    @api.response(409, 'Пользователь с таким email уже существует')
    @api.response(409, 'Данное имя пользователя уже занято')
    def post(self):
        """Регистрация нового пользователя"""
        try:
            # Use try/except to handle validation errors specifically
            try:
                register_data = UserCreateSchema().load(request.json)
            except ValidationError as ve:
                return {'message': 'Ошибка валидации', 'errors': ve.messages}, 400
            
            # Проверяем, существует ли пользователь с таким email
            existing_email = User.query.filter_by(email=register_data['email']).first()
            if existing_email:
                return {'message': 'Пользователь с таким email уже существует'}, 409
                
            existing_username = User.query.filter_by(username=register_data['username']).first()
            if existing_username:
                return {'message': 'Данное имя пользователя уже занято'}, 409
            
            # Создаем нового пользователя
            user = User(
                email=register_data['email'],
                username=register_data['username'],
                is_active=True,
                created_at=datetime.utcnow(),
                last_login=datetime.utcnow()
            )
            
            user.set_password(register_data['password'])
            print(f"Registering user: {register_data}, with username: {user.username}")
            db.session.add(user)

            # Создание роли user по умолчанию (если нужно)
            # user_role = Role.query.filter_by(name='user').first()
            # if not user_role:
            #     user_role = Role(name='user', description='Обычный пользователь системы')
            #     db.session.add(user_role)
            
            # user.roles.append(user_role)            

            db.session.commit()
            
            # Создание токенов
            access_token = create_access_token(identity=str(user.id))
            refresh_token = create_refresh_token(identity=str(user.id))
            
            # Получение информации о браузере и устройстве
            user_agent_string = request.user_agent.string
            user_agent = user_agents.parse(user_agent_string)
            
            # Создание записи о сессии
            session = UserSession(
                user_id=user.id,
                refresh_token=refresh_token,
                user_agent=user_agent_string,
                ip_address=request.remote_addr,
                browser_family=user_agent.browser.family,
                browser_version=user_agent.browser.version_string,
                os_family=user_agent.os.family,
                os_version=user_agent.os.version_string,
                device_family=user_agent.device.family,
                device_brand=getattr(user_agent.device, 'brand', None),
                device_model=getattr(user_agent.device, 'model', None),
                is_mobile=user_agent.is_mobile,
                is_tablet=user_agent.is_tablet,
                is_pc=user_agent.is_pc,
                is_bot=user_agent.is_bot,
                expires_at=datetime.utcnow() + (
                    flask.current_app.config['JWT_REFRESH_TOKEN_EXPIRES'] 
                    if isinstance(flask.current_app.config['JWT_REFRESH_TOKEN_EXPIRES'], timedelta)
                    else timedelta(seconds=flask.current_app.config['JWT_REFRESH_TOKEN_EXPIRES'])
                ),
                is_active=True
            )
            
            db.session.add(session)
            db.session.commit()
            
            return {
                'message': 'Регистрация успешно завершена',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'is_active': user.is_active
                },
                'access_token': access_token,
                'refresh_token': refresh_token
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'message': f'Ошибка при регистрации: {str(e)}'}, 400

@api.route('/login')
class Login(Resource):
    """Вход в систему"""
    
    @api.expect(login_model)
    @api.response(200, 'Успешный вход')
    @api.response(401, 'Неверные учетные данные')
    def post(self):
        """Аутентификация пользователя"""
        try:
            login_data = LoginSchema().load(request.json)
            
            user = User.query.filter_by(email=login_data['email']).first()
            
            if not user or not user.check_password(login_data['password']):
                return {'message': 'Неверный email или пароль'}, 401
            
            if not user.is_active:
                return {'message': 'Пользователь деактивирован'}, 401
                
            if user.deleted:
                return {'message': 'Учетная запись удалена'}, 401
            
            # Обновление времени последнего входа
            user.last_login = datetime.utcnow()
            
            # Получение информации о браузере и устройстве
            user_agent_string = request.user_agent.string
            user_agent = user_agents.parse(user_agent_string)
            
            # Создание токенов
            access_token = create_access_token(identity=str(user.id))
            refresh_token = create_refresh_token(identity=str(user.id))
            
            # Создание записи о сессии с расширенной информацией
            session = UserSession(
                user_id=user.id,
                refresh_token=refresh_token,
                user_agent=user_agent_string,
                ip_address=request.remote_addr,
                browser_family=user_agent.browser.family,
                browser_version=user_agent.browser.version_string,
                os_family=user_agent.os.family,
                os_version=user_agent.os.version_string,
                device_family=user_agent.device.family,
                device_brand=getattr(user_agent.device, 'brand', None),
                device_model=getattr(user_agent.device, 'model', None),
                is_mobile=user_agent.is_mobile,
                is_tablet=user_agent.is_tablet,
                is_pc=user_agent.is_pc,
                is_bot=user_agent.is_bot,
                expires_at=datetime.utcnow() + (
                    flask.current_app.config['JWT_REFRESH_TOKEN_EXPIRES'] 
                    if isinstance(flask.current_app.config['JWT_REFRESH_TOKEN_EXPIRES'], timedelta)
                    else timedelta(seconds=flask.current_app.config['JWT_REFRESH_TOKEN_EXPIRES'])
                ),
                is_active=True
            )
            
            db.session.add(session)
            db.session.commit()
            
            return {
                'message': 'Успешный вход в систему',
                'user': UserCreateSchema(exclude=['password']).dump(user),
                'access_token': access_token,
                'refresh_token': refresh_token
            }, 200
            
        except ValidationError as e:
            return {'message': 'Ошибка валидации', 'errors': e.messages}, 400

@api.route('/logout')
class Logout(Resource):
    """Выход из системы"""
    
    @jwt_required()
    @api.doc(security='jwt')
    @api.expect(logout_model)
    @api.response(200, 'Успешный выход из системы')
    @api.response(400, 'Ошибка при выходе из системы')
    def post(self):
        """Выход пользователя из системы"""
        try:
            # Получаем ID пользователя из JWT токена
            user_id = get_jwt_identity()
            
            # Находим активную сессию пользователя
            # Если есть refresh_token в запросе, используем его для поиска конкретной сессии
            if request.is_json and request.json and 'refresh_token' in request.json:
                refresh_token = request.json.get('refresh_token')
                session = UserSession.query.filter_by(
                    user_id=user_id,
                    refresh_token=refresh_token,
                    is_active=True
                ).first()
                
                if session:
                    session.is_active = False
                    db.session.commit()
            else:
                # Если refresh_token не предоставлен, деактивируем все сессии пользователя
                sessions = UserSession.query.filter_by(
                    user_id=user_id,
                    is_active=True
                ).all()
                
                for session in sessions:
                    session.is_active = False
                
                db.session.commit()
            
            # Создаем ответ
            response = jsonify({'message': 'Успешный выход из системы'})
            
            # Очищаем куки независимо от наличия токена
            clear_auth_cookies(response)
            
            return response
        except Exception as e:
            return {'message': f'Ошибка при выходе из системы: {str(e)}'}, 400

@api.route('/refresh')
class RefreshToken(Resource):
    """Обновление токена"""
    
    @jwt_required(refresh=True)
    def post(self):
        """Обновление access токена"""
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        
        # Проверяем, не удалена ли учетная запись
        if user.deleted:
            return {'message': 'Учетная запись удалена'}, 401
            
        access_token = create_access_token(identity=str(user_id))
        refresh_token = create_refresh_token(identity=str(user_id))
        
        # Обновляем информацию о сессии
        old_refresh_token = request.json.get('refresh_token')
        if old_refresh_token:
            old_session = UserSession.query.filter_by(refresh_token=old_refresh_token).first()
            if old_session:
                old_session.is_active = False
                db.session.commit()
        
        # Создаем новую сессию
        user_agent_string = request.user_agent.string
        user_agent = user_agents.parse(user_agent_string)
        
        session = UserSession(
            user_id=user.id,
            refresh_token=refresh_token,
            user_agent=user_agent_string,
            ip_address=request.remote_addr,
            browser_family=user_agent.browser.family,
            browser_version=user_agent.browser.version_string,
            os_family=user_agent.os.family,
            os_version=user_agent.os.version_string,
            device_family=user_agent.device.family,
            device_brand=getattr(user_agent.device, 'brand', None),
            device_model=getattr(user_agent.device, 'model', None),
            is_mobile=user_agent.is_mobile,
            is_tablet=user_agent.is_tablet,
            is_pc=user_agent.is_pc,
            is_bot=user_agent.is_bot,
            expires_at=datetime.utcnow() + (
                flask.current_app.config['JWT_REFRESH_TOKEN_EXPIRES'] 
                if isinstance(flask.current_app.config['JWT_REFRESH_TOKEN_EXPIRES'], timedelta)
                else timedelta(seconds=flask.current_app.config['JWT_REFRESH_TOKEN_EXPIRES'])
            ),
            is_active=True
        )
        
        db.session.add(session)
        db.session.commit()
        
        return {
            'message': 'Токен успешно обновлен',
            'user': UserCreateSchema(exclude=['password']).dump(user),
            'access_token': access_token,
            'refresh_token': refresh_token
        }, 200
