"""
Модели для системы авторизации и управления пользователями
"""
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table, JSON
from sqlalchemy.orm import relationship
from app.extensions import db
from app.models.base import BaseModel, HistoryModel

class Role(BaseModel):
    """Модель ролей"""
    __tablename__ = 'role'

    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255))

class RoleHistory(HistoryModel):
    """История изменений ролей"""
    __tablename__ = 'role_history'
    
    role_id = Column(Integer, ForeignKey('role.id'), nullable=False)
    role = relationship('Role')

class User(BaseModel):
    """Модель пользователя"""
    __tablename__ = 'user'

    username = Column(String(50), unique=True, nullable=True)  # Добавлено поле username
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(128))
    first_name = Column(String(64))
    last_name = Column(String(64))
    patronymic = Column(String(64))
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime)
    roles = relationship('Role', secondary='user_role', backref='users')

    def set_password(self, password):
        """Установка хэша пароля"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Проверка пароля"""
        return check_password_hash(self.password_hash, password)

    

class UserHistory(HistoryModel):
    """История изменений пользователя"""
    __tablename__ = 'user_history'
    
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    user = relationship('User', foreign_keys=[user_id])

class UserRole(BaseModel):
    """Модель связи пользователя и роли"""
    __tablename__ = 'user_role'
    
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    role_id = Column(Integer, ForeignKey('role.id'), nullable=False)
    
    user = relationship('User', viewonly=True, overlaps="roles,users")
    role = relationship('Role', viewonly=True, overlaps="roles,users")
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'role_id', name='uq_user_role'),
    )

class UserSession(BaseModel):
    """Модель сессии пользователя"""
    __tablename__ = 'user_session'

    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    refresh_token = Column(String(255), unique=True)
    user_agent = Column(String(255))  # Информация о браузере/устройстве
    ip_address = Column(String(45))
    browser_family = Column(String(50))
    browser_version = Column(String(50))
    os_family = Column(String(50))
    os_version = Column(String(50))
    device_family = Column(String(50))
    device_brand = Column(String(50))
    device_model = Column(String(50))
    is_mobile = Column(Boolean, default=False)
    is_tablet = Column(Boolean, default=False)
    is_pc = Column(Boolean, default=False)
    is_bot = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    
    user = relationship('User', backref='sessions')
