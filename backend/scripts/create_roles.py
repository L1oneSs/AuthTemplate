"""
Скрипт для создания базовых ролей в системе
"""
import sys
import os

# Добавляем путь к директории backend в sys.path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, backend_path)

try:
    from app import create_app
    from app.extensions import db
    from app.models.auth import Role
    print("Модули успешно импортированы")
except ImportError as e:
    print(f"Ошибка импорта: {e}")
    print(f"Текущие пути поиска Python:")
    for p in sys.path:
        print(f" - {p}")
    sys.exit(1)

def create_default_roles():
    """Создание ролей по умолчанию"""
    # Проверяем, существуют ли роли
    user_role = Role.query.filter_by(name='user').first()
    admin_role = Role.query.filter_by(name='admin').first()
    
    # Если роли не существуют, создаем их
    if not user_role:
        user_role = Role(name='user', description='Обычный пользователь системы')
        db.session.add(user_role)
        print('Создана роль "user"')
    else:
        print('Роль "user" уже существует')
    
    if not admin_role:
        admin_role = Role(name='admin', description='Администратор с полным доступом')
        db.session.add(admin_role)
        print('Создана роль "admin"')
    else:
        print('Роль "admin" уже существует')
    
    # Сохраняем изменения в БД
    db.session.commit()
    print("Все роли успешно созданы/обновлены")

def main():
    print("Запуск скрипта создания базовых ролей...")
    
    try:
        # Создаем экземпляр приложения и контекст приложения
        app = create_app('development')
        with app.app_context():
            create_default_roles()
    except Exception as e:
        print(f"Ошибка при выполнении: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()