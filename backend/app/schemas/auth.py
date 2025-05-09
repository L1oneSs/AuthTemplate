"""
Схемы для аутентификации и управления пользователями
"""
from marshmallow import Schema, fields, validates, ValidationError, validates_schema, post_load
from app.extensions import ma
from app.models.auth import User, Role, UserSession, UserRole
from app.schemas.base import BaseSchema, HistorySchema

class RoleSchema(BaseSchema):
    """Схема ролей"""
    class Meta:
        model = Role
        load_instance = True

    name = fields.String(required=True)
    description = fields.String()


class UserBaseSchema(BaseSchema):
    """Базовая схема пользователя"""
    class Meta:
        model = User
        load_instance = True
    
    username = fields.String(required=False)
    email = fields.Email(required=True)
    first_name = fields.String()
    last_name = fields.String()
    patronymic = fields.String()
    is_active = fields.Boolean(dump_only=True)
    last_login = fields.DateTime(dump_only=True)
    roles = fields.List(fields.Nested(RoleSchema))

class UserCreateSchema(Schema):
    """Схема для регистрации пользователя"""
    email = fields.Email(required=True)
    username = fields.String(required=True)
    password = fields.String(required=True, load_only=True)
    
    @validates('password')
    def validate_password(self, value, **kwargs):
        """Базовая проверка пароля"""
        if len(value) < 6:
            raise ValidationError('Пароль должен содержать минимум 6 символов')
        return value

    @validates('username')
    def validate_username(self, value, **kwargs):
        """Проверка имени пользователя"""
        if len(value) < 3:
            raise ValidationError('Имя пользователя должно содержать минимум 3 символа')
        return value

class UserUpdateSchema(BaseSchema):
    """Схема для обновления данных пользователя"""
    class Meta:
        model = User
        load_instance = False
        
    username = fields.String()
    email = fields.Email()
    first_name = fields.String()
    last_name = fields.String()
    patronymic = fields.String()
    is_active = fields.Boolean(dump_only=True)
    last_login = fields.DateTime(dump_only=True)
    roles = fields.List(fields.Nested(RoleSchema), dump_only=True)
    current_password = fields.String(load_only=True)
    new_password = fields.String(load_only=True)
    confirm_new_password = fields.String(load_only=True)

    @validates_schema
    def validate_password_update(self, data, **kwargs):
        """Проверка паролей при обновлении"""
        if 'new_password' in data:
            if not data.get('current_password'):
                raise ValidationError('Необходимо указать текущий пароль')
            if not data.get('confirm_new_password'):
                raise ValidationError('Необходимо подтвердить новый пароль')
            if data['new_password'] != data['confirm_new_password']:
                raise ValidationError('Новые пароли не совпадают')

class LoginSchema(Schema):
    """Схема для входа в систему"""
    email = fields.String(required=True)
    password = fields.String(required=True)

class TokenSchema(Schema):
    """Схема для JWT токенов"""
    access_token = fields.String(dump_only=True)
    refresh_token = fields.String(dump_only=True)
    token_type = fields.String(dump_only=True, dump_default='bearer')

class UserSessionSchema(BaseSchema):
    """Схема для сессий пользователя"""
    class Meta:
        model = UserSession
        load_instance = True

    user_id = fields.Integer(dump_only=True)
    user_agent = fields.String(dump_only=True)
    ip_address = fields.String(dump_only=True)
    browser_family = fields.String(dump_only=True)
    browser_version = fields.String(dump_only=True)
    os_family = fields.String(dump_only=True)
    os_version = fields.String(dump_only=True)
    device_family = fields.String(dump_only=True)
    device_brand = fields.String(dump_only=True)
    device_model = fields.String(dump_only=True)
    is_mobile = fields.Boolean(dump_only=True)
    is_tablet = fields.Boolean(dump_only=True)
    is_pc = fields.Boolean(dump_only=True)
    is_bot = fields.Boolean(dump_only=True)
    expires_at = fields.DateTime(dump_only=True)
    is_active = fields.Boolean(dump_only=True)

class RoleHistorySchema(HistorySchema):
    """Схема для истории изменений ролей"""
    role_id = fields.Integer(required=True)

class UserHistorySchema(HistorySchema):
    """Схема для истории изменений пользователя"""
    user_id = fields.Integer(required=True)

class UserRoleSchema(BaseSchema):
    """Схема для связи пользователя и роли"""
    class Meta:
        model = UserRole
        load_instance = True
    
    user_id = fields.Integer(required=True)
    role_id = fields.Integer(required=True)
    role = fields.Nested(RoleSchema, dump_only=True)
    user = fields.Nested(UserBaseSchema, dump_only=True)
