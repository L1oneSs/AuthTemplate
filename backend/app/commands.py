"""
Команды CLI для Flask
"""
import click
from flask.cli import with_appcontext

from app.helpers import create_default_roles
from app.helpers.make_admin import make_user_admin

@click.command('init-roles')
@with_appcontext
def init_roles_command():
    """Инициализация базовых ролей в системе."""
    create_default_roles()
    click.echo('Базовые роли успешно добавлены.')


@click.command('make-admin')
@click.option('--email', required=True, help='Email пользователя')
@click.option('--username', required=True, help='Username пользователя')
@with_appcontext
def make_admin_command(email, username):
    """Назначение роли администратора пользователю по email и username."""
    _, message = make_user_admin(email, username)
    click.echo(message)

def register_commands(app):
    """Регистрация команд Flask CLI"""
    app.cli.add_command(init_roles_command)
    app.cli.add_command(make_admin_command)