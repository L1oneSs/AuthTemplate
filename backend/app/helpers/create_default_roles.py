import click
from app.extensions import db
from app.models.auth import Role

def create_default_roles():
    """Создание ролей по умолчанию"""
    # Проверяем, существуют ли роли
    user_role = Role.query.filter_by(name='user').first()
    admin_role = Role.query.filter_by(name='admin').first()
    
    # Если роли не существуют, создаем их
    if not user_role:
        user_role = Role(name='user', description='Обычный пользователь системы')
        db.session.add(user_role)
        click.echo('Создана роль "user"')
    
    if not admin_role:
        admin_role = Role(name='admin', description='Администратор с полным доступом')
        db.session.add(admin_role)
        click.echo('Создана роль "admin"')
    
    db.session.commit()