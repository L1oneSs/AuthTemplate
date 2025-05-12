from app.extensions import db
from app.models.auth import User, Role

def make_user_admin(email, username):
    """
    Назначение пользователю роли администратора по email и username
    
    :param email: Email пользователя
    :param username: Username пользователя
    :return: Кортеж (успех, сообщение)
    """
    # Поиск пользователя по обоим параметрам
    user = User.query.filter_by(email=email, username=username).first()

    if not user:
        return False, f'Ошибка: Пользователь с email {email} и username {username} не найден'

    # Поиск роли администратора
    admin_role = Role.query.filter_by(name='admin').first()
    if not admin_role:
        return False, 'Ошибка: Роль "admin" не найдена. Запустите сначала команду init-roles или соответствующий скрипт для создания ролей.'

    # Проверяем, есть ли уже роль админа у пользователя
    if admin_role in user.roles:
        return False, f'Пользователь {user.username} ({user.email}) уже имеет роль администратора'

    # Добавляем роль админа
    user.roles.append(admin_role)
    db.session.commit()
    return True, f'Пользователю {user.username} ({user.email}) успешно назначена роль администратора'