"""
Скрипт для запуска функции назначения роли администратора
"""
import sys
import os

# Добавляем путь к директории backend в sys.path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, backend_path)

try:
    from app import create_app
    from app.helpers.make_admin import make_user_admin
    print("Модули успешно импортированы")
except ImportError as e:
    print(f"Ошибка импорта: {e}")
    print(f"Текущие пути поиска Python:")
    for p in sys.path:
        print(f" - {p}")
    sys.exit(1)

def main():
    if len(sys.argv) != 3:
        print("Использование: python create_admin.py <email> <username>")
        return
    
    email = sys.argv[1]
    username = sys.argv[2]
    
    print(f"Создание приложения с конфигурацией 'development'...")
    try:
        app = create_app('development')
        with app.app_context():
            print(f"Назначение роли администратора пользователю {email} ({username})...")
            success, message = make_user_admin(email, username)
            print(message)
    except Exception as e:
        print(f"Ошибка при выполнении: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()