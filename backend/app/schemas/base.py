"""
Базовые схемы для валидации данных
"""
from marshmallow import Schema, fields, validates_schema, ValidationError
from app.extensions import ma

class BaseSchema(ma.SQLAlchemySchema):
    """Базовая схема для всех моделей"""
    
    id = fields.Integer(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    deleted = fields.Boolean(dump_only=True)

class HistorySchema(BaseSchema):
    """Базовая схема для истории изменений"""
    
    action = fields.String(required=True)
    changed_by_id = fields.Integer(required=True)
    timestamp = fields.DateTime(dump_only=True)
    changes = fields.Dict(keys=fields.String(), values=fields.Raw())

class ErrorSchema(Schema):
    """Схема для ошибок"""
    
    message = fields.String(required=True)
    errors = fields.Dict(keys=fields.String(), values=fields.List(fields.String()))
    status_code = fields.Integer()

class SuccessSchema(Schema):
    """Схема для успешных ответов"""
    
    message = fields.String()
    data = fields.Raw()
