# AuthTemplate

<div align="center">
  <div>
    <button onclick="showLanguage('ru')">Русский</button>
    <button onclick="showLanguage('en')">English</button>
    <button onclick="showLanguage('zh')">中文</button>
  </div>
</div>

<script>
  function showLanguage(lang) {
    document.querySelectorAll('.language-section').forEach(section => {
      section.style.display = section.id === lang ? 'block' : 'none';
    });
  }
  document.addEventListener('DOMContentLoaded', () => showLanguage('en'));
</script>

---

<div id="ru" class="language-section" style="display: none;">
## 🇷🇺 Русский

### 📋 Введение

**AuthTemplate** — это полноценный шаблон, содержащий функционал авторизации для полноценного веб-приложения. Включает в себя:

- **Backend**: Реализован на Flask (Python) с поддержкой ORM, миграций и JWT-авторизации
- **Frontend**: Разработан на Next.js/React с современным UI и полной интеграцией с API

Данный шаблон значительно сократит время разработки вашего проекта, предоставляя готовую систему авторизации и базовую архитектуру приложения.

### 🚀 Инструкция по установке

#### Frontend (Next.js)

1. Перейдите в папку frontend:

```bash
cd frontend
```

2. Установите зависимости:

```bash
pnpm i  # или npm i
```

3. Создайте файл `.env` по примеру `.env.example`:

```
NEXT_PUBLIC_URL="http://localhost:7018"
NEXT_PUBLIC_API_URL='http://127.0.0.1:7020/api'
```

> **Важно**: Не забудьте указать приписку `/api` в `NEXT_PUBLIC_API_URL`!

4. Запустите клиент:

```bash
pnpm run dev  # или npm run dev
```

#### Backend (Flask)

1. Перейдите в папку backend:

```bash
cd backend
```

2. Создайте виртуальное окружение:

```bash
# Создание
python -m venv venv

# Активация для Windows
venv\Scripts\activate

# Активация для macOS/Linux
source venv/bin/activate
```

3. Установите зависимости:

```bash
pip install -r requirements.txt
```

4. Создайте файл `.env` по примеру `.env.example`.

**Переменные окружения backend:**

| Переменная                  | Описание                                                    |
| --------------------------- | ----------------------------------------------------------- |
| `FLASK_APP`                 | Точка входа в приложение Flask                              |
| `FLASK_ENV`                 | Режим работы (development/production)                       |
| `FLASK_DEBUG`               | Включение/отключение режима отладки (1/0)                   |
| `DATABASE_URL`              | URL для подключения к базе данных                           |
| `DEV_DATABASE_URL`          | URL для подключения к базе данных в режиме разработки       |
| `SECRET_KEY`                | Секретный ключ для шифрования сессий                        |
| `JWT_SECRET_KEY`            | Ключ для JWT токенов                                        |
| `JWT_COOKIE_CSRF_PROTECT`   | Защита от CSRF в cookie (True/False)                        |
| `JWT_ACCESS_TOKEN_EXPIRES`  | Время жизни access токена (в секундах)                      |
| `JWT_REFRESH_TOKEN_EXPIRES` | Время жизни refresh токена (в секундах)                     |
| `JWT_TOKEN_LOCATION`        | Местоположение JWT токенов (headers, cookies)               |
| `SMTP_SERVER`               | SMTP сервер для отправки почты                              |
| `SMTP_PORT`                 | Порт SMTP сервера                                           |
| `SMTP_USERNAME`             | Имя пользователя для SMTP сервера                           |
| `SMTP_PASSWORD`             | Пароль для SMTP сервера                                     |
| `SENDER_EMAIL`              | Email отправителя                                           |
| `FRONTEND_URL`              | URL фронтенд приложения                                     |
| `TOKEN_SALT`                | Соль для генерации токенов                                  |
| `TOKEN_LIFETIME`            | Время жизни токена (в секундах)                             |
| `LOG_LEVEL`                 | Уровень логирования (DEBUG, INFO, WARNING, ERROR, CRITICAL) |
| `LOG_FILE`                  | Путь к файлу логов                                          |

5. Запустите сервер:

```bash
# Режим разработки
python run_dev.py

# Режим продакшена для UNIX-систем
python run_prod_unix.py

# Режим продакшена для Windows (не рекомендуется)
python run_prod_windows.py
```

> **Документация API** доступна по адресу [http://127.0.0.1:7020/api/docs](http://127.0.0.1:7020/api/docs) после запуска сервера.

### 📂 Структура проекта

```
AuthTemplate/
├── backend/                  # Flask приложение
│   ├── app/                  # Основной модуль приложения
│   │   ├── api/              # API маршруты и ресурсы
│   │   ├── models/           # Модели данных
│   │   ├── services/         # Бизнес-логика приложения
│   │   ├── extensions.py     # Расширения Flask
│   │   └── config.py         # Конфигурация приложения
│   ├── migrations/           # Миграции базы данных
│   ├── .env.example          # Пример файла окружения
│   └── requirements.txt      # Зависимости Python
│
├── frontend/                 # Next.js приложение
│   ├── public/               # Статические файлы
│   ├── src/                  # Исходный код
│   │   ├── components/       # React компоненты
│   │   ├── pages/            # Страницы приложения
│   │   ├── hooks/            # React хуки
│   │   ├── services/         # Сервисы для работы с API
│   │   └── store/            # Управление состоянием
│   ├── .env.example          # Пример файла окружения
│   └── package.json          # Зависимости и скрипты NPM
│
└── README.md                 # Документация проекта
```

### 📊 Модели базы данных

#### User (Пользователь)

- `id` - Уникальный идентификатор
- `username` - Логин пользователя
- `email` - Электронная почта
- `password_hash` - Хеш пароля
- `first_name` - Имя
- `last_name` - Фамилия
- `patronymic` - Отчество
- `is_active` - Статус активности
- `last_login` - Дата последнего входа
- `created_at` - Дата создания
- `updated_at` - Дата обновления
- `deleted` - Признак удаления (soft delete)

#### Role (Роль)

- `id` - Уникальный идентификатор
- `name` - Название роли
- `description` - Описание роли
- `created_at` - Дата создания
- `updated_at` - Дата обновления
- `deleted` - Признак удаления

#### UserRole (Связь пользователя и роли)

- `id` - Уникальный идентификатор
- `user_id` - ID пользователя
- `role_id` - ID роли
- `created_at` - Дата создания
- `updated_at` - Дата обновления
- `deleted` - Признак удаления

#### UserSession (Сессия пользователя)

- `id` - Уникальный идентификатор
- `user_id` - ID пользователя
- `refresh_token` - Токен обновления
- `user_agent` - Информация о браузере
- `ip_address` - IP адрес
- `browser_family` - Семейство браузера
- `browser_version` - Версия браузера
- `os_family` - Операционная система
- `os_version` - Версия операционной системы
- `device_family` - Тип устройства
- `device_brand` - Бренд устройства
- `device_model` - Модель устройства
- `is_mobile` - Признак мобильного устройства
- `is_tablet` - Признак планшета
- `is_pc` - Признак ПК
- `is_bot` - Признак бота
- `expires_at` - Дата истечения
- `is_active` - Статус активности
</div>

<div id="en" class="language-section" style="display: block;">
## 🇬🇧 English

### 📋 Introduction

**AuthTemplate** is a complete template containing authentication functionality for a full-fledged web application. It includes:

- **Backend**: Implemented using Flask (Python) with ORM support, migrations, and JWT authentication
- **Frontend**: Developed with Next.js/React featuring a modern UI and full API integration

This template will significantly reduce your project development time by providing a ready-to-use authentication system and basic application architecture.

### 🚀 Installation Guide

#### Frontend (Next.js)

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
pnpm i  # or npm i
```

3. Create a `.env` file based on `.env.example`:

```
NEXT_PUBLIC_URL="http://localhost:7018"
NEXT_PUBLIC_API_URL='http://127.0.0.1:7020/api'
```

> **Important**: Don't forget to include the `/api` suffix in `NEXT_PUBLIC_API_URL`!

4. Start the client:

```bash
pnpm run dev  # or npm run dev
```

#### Backend (Flask)

1. Navigate to the backend folder:

```bash
cd backend
```

2. Create a virtual environment:

```bash
# Creation
python -m venv venv

# Activation for Windows
venv\Scripts\activate

# Activation for macOS/Linux
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`.

**Backend environment variables:**

| Variable                    | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| `FLASK_APP`                 | Flask application entry point                         |
| `FLASK_ENV`                 | Operating mode (development/production)               |
| `FLASK_DEBUG`               | Enable/disable debug mode (1/0)                       |
| `DATABASE_URL`              | Database connection URL                               |
| `DEV_DATABASE_URL`          | Development database connection URL                   |
| `SECRET_KEY`                | Secret key for session encryption                     |
| `JWT_SECRET_KEY`            | Key for JWT tokens                                    |
| `JWT_COOKIE_CSRF_PROTECT`   | CSRF protection for cookies (True/False)              |
| `JWT_ACCESS_TOKEN_EXPIRES`  | Access token lifetime (in seconds)                    |
| `JWT_REFRESH_TOKEN_EXPIRES` | Refresh token lifetime (in seconds)                   |
| `JWT_TOKEN_LOCATION`        | JWT token location (headers, cookies)                 |
| `SMTP_SERVER`               | SMTP server for sending emails                        |
| `SMTP_PORT`                 | SMTP server port                                      |
| `SMTP_USERNAME`             | SMTP server username                                  |
| `SMTP_PASSWORD`             | SMTP server password                                  |
| `SENDER_EMAIL`              | Sender email address                                  |
| `FRONTEND_URL`              | Frontend application URL                              |
| `TOKEN_SALT`                | Salt for token generation                             |
| `TOKEN_LIFETIME`            | Token lifetime (in seconds)                           |
| `LOG_LEVEL`                 | Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL) |
| `LOG_FILE`                  | Log file path                                         |

5. Launch the server:

```bash
# Development mode
python run_dev.py

# Production mode for UNIX systems
python run_prod_unix.py

# Production mode for Windows (not recommended)
python run_prod_windows.py
```

> **API Documentation** is available at [http://127.0.0.1:7020/api/docs](http://127.0.0.1:7020/api/docs) after starting the server.

### 📂 Project Structure

```
AuthTemplate/
├── backend/                  # Flask application
│   ├── app/                  # Main application module
│   │   ├── api/              # API routes and resources
│   │   ├── models/           # Data models
│   │   ├── services/         # Application business logic
│   │   ├── extensions.py     # Flask extensions
│   │   └── config.py         # Application configuration
│   ├── migrations/           # Database migrations
│   ├── .env.example          # Environment file example
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # Next.js application
│   ├── public/               # Static files
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   ├── pages/            # Application pages
│   │   ├── hooks/            # React hooks
│   │   ├── services/         # Services for API interaction
│   │   └── store/            # State management
│   ├── .env.example          # Environment file example
│   └── package.json          # NPM dependencies and scripts
│
└── README.md                 # Project documentation
```

### 📊 Database Models

#### User

- `id` - Unique identifier
- `username` - User login
- `email` - Email address
- `password_hash` - Password hash
- `first_name` - First name
- `last_name` - Last name
- `patronymic` - Patronymic/middle name
- `is_active` - Activity status
- `last_login` - Last login date
- `created_at` - Creation date
- `updated_at` - Update date
- `deleted` - Deletion flag (soft delete)

#### Role

- `id` - Unique identifier
- `name` - Role name
- `description` - Role description
- `created_at` - Creation date
- `updated_at` - Update date
- `deleted` - Deletion flag

#### UserRole (User-role relationship)

- `id` - Unique identifier
- `user_id` - User ID
- `role_id` - Role ID
- `created_at` - Creation date
- `updated_at` - Update date
- `deleted` - Deletion flag

#### UserSession

- `id` - Unique identifier
- `user_id` - User ID
- `refresh_token` - Refresh token
- `user_agent` - Browser information
- `ip_address` - IP address
- `browser_family` - Browser family
- `browser_version` - Browser version
- `os_family` - Operating system
- `os_version` - OS version
- `device_family` - Device type
- `device_brand` - Device brand
- `device_model` - Device model
- `is_mobile` - Mobile device flag
- `is_tablet` - Tablet device flag
- `is_pc` - PC flag
- `is_bot` - Bot flag
- `expires_at` - Expiration date
- `is_active` - Activity status
</div>

<div id="zh" class="language-section" style="display: none;">
## 🇨🇳 中文

### 📋 介绍

**AuthTemplate** 是一个完整的模板，含有全功能Web应用程序的授权功能。包括：

- **后端**：基于Flask (Python)实现，支持ORM、数据迁移和JWT授权
- **前端**：基于Next.js/React开发，具有现代UI和完整的API集成

此模板将通过提供现成的授权系统和基本应用程序架构，显著缩短您的项目开发时间。

### 🚀 安装指南

#### 前端 (Next.js)

1. 进入前端文件夹：

```bash
cd frontend
```

2. 安装依赖：

```bash
pnpm i  # 或 npm i
```

3. 根据`.env.example`创建`.env`文件：

```
NEXT_PUBLIC_URL="http://localhost:7018"
NEXT_PUBLIC_API_URL='http://127.0.0.1:7020/api'
```

> **重要**：不要忘记在`NEXT_PUBLIC_API_URL`中包含`/api`后缀！

4. 启动客户端：

```bash
pnpm run dev  # 或 npm run dev
```

#### 后端 (Flask)

1. 进入后端文件夹：

```bash
cd backend
```

2. 创建虚拟环境：

```bash
# 创建
python -m venv venv

# Windows激活
venv\Scripts\activate

# macOS/Linux激活
source venv/bin/activate
```

3. 安装依赖：

```bash
pip install -r requirements.txt
```

4. 根据`.env.example`创建`.env`文件。

**后端环境变量：**

| 变量                        | 描述                                             |
| --------------------------- | ------------------------------------------------ |
| `FLASK_APP`                 | Flask应用程序入口点                              |
| `FLASK_ENV`                 | 运行模式 (development/production)                |
| `FLASK_DEBUG`               | 启用/禁用调试模式 (1/0)                          |
| `DATABASE_URL`              | 数据库连接URL                                    |
| `DEV_DATABASE_URL`          | 开发模式数据库连接URL                            |
| `SECRET_KEY`                | 会话加密的密钥                                   |
| `JWT_SECRET_KEY`            | JWT令牌的密钥                                    |
| `JWT_COOKIE_CSRF_PROTECT`   | Cookie的CSRF保护 (True/False)                    |
| `JWT_ACCESS_TOKEN_EXPIRES`  | 访问令牌的生存时间（秒）                         |
| `JWT_REFRESH_TOKEN_EXPIRES` | 刷新令牌的生存时间（秒）                         |
| `JWT_TOKEN_LOCATION`        | JWT令牌位置 (headers, cookies)                   |
| `SMTP_SERVER`               | 发送邮件的SMTP服务器                             |
| `SMTP_PORT`                 | SMTP服务器端口                                   |
| `SMTP_USERNAME`             | SMTP服务器用户名                                 |
| `SMTP_PASSWORD`             | SMTP服务器密码                                   |
| `SENDER_EMAIL`              | 发件人电子邮箱                                   |
| `FRONTEND_URL`              | 前端应用程序URL                                  |
| `TOKEN_SALT`                | 令牌生成的盐                                     |
| `TOKEN_LIFETIME`            | 令牌生存时间（秒）                               |
| `LOG_LEVEL`                 | 日志级别 (DEBUG, INFO, WARNING, ERROR, CRITICAL) |
| `LOG_FILE`                  | 日志文件路径                                     |

5. 启动服务器：

```bash
# 开发模式
python run_dev.py

# UNIX系统的生产模式
python run_prod_unix.py

# Windows的生产模式（不推荐）
python run_prod_windows.py
```

> **API文档**在服务器启动后可通过 [http://127.0.0.1:7020/api/docs](http://127.0.0.1:7020/api/docs) 访问。

### 📂 项目结构

```
AuthTemplate/
├── backend/                  # Flask应用程序
│   ├── app/                  # 主应用程序模块
│   │   ├── api/              # API路由和资源
│   │   ├── models/           # 数据模型
│   │   ├── services/         # 应用程序业务逻辑
│   │   ├── extensions.py     # Flask扩展
│   │   └── config.py         # 应用程序配置
│   ├── migrations/           # 数据库迁移
│   ├── .env.example          # 环境文件示例
│   └── requirements.txt      # Python依赖
│
├── frontend/                 # Next.js应用程序
│   ├── public/               # 静态文件
│   ├── src/                  # 源代码
│   │   ├── components/       # React组件
│   │   ├── pages/            # 应用程序页面
│   │   ├── hooks/            # React钩子
│   │   ├── services/         # API交互服务
│   │   └── store/            # 状态管理
│   ├── .env.example          # 环境文件示例
│   └── package.json          # NPM依赖和脚本
│
└── README.md                 # 项目文档
```

### 📊 数据库模型

#### User (用户)

- `id` - 唯一标识符
- `username` - 用户登录名
- `email` - 电子邮件地址
- `password_hash` - 密码哈希
- `first_name` - 名字
- `last_name` - 姓氏
- `patronymic` - 父称
- `is_active` - 活动状态
- `last_login` - 最后登录日期
- `created_at` - 创建日期
- `updated_at` - 更新日期
- `deleted` - 删除标志（软删除）

#### Role

- `id` - 唯一标识符
- `name` - 角色名称
- `description` - 角色描述
- `created_at` - 创建日期
- `updated_at` - 更新日期
- `deleted` - 删除标志

#### UserRole (用户-角色关系)

- `id` - 唯一标识符
- `user_id` - 用户ID
- `role_id` - 角色ID
- `created_at` - 创建日期
- `updated_at` - 更新日期
- `deleted` - 删除标志

#### UserSession (用户会话)

- `id` - 唯一标识符
- `user_id` - 用户ID
- `refresh_token` - 刷新令牌
- `user_agent` - 浏览器信息
- `ip_address` - IP地址
- `browser_family` - 浏览器系列
- `browser_version` - 浏览器版本
- `os_family` - 操作系统
- `os_version` - 操作系统版本
- `device_family` - 设备类型
- `device_brand` - 设备品牌
- `device_model` - 设备型号
- `is_mobile` - 移动设备标志
- `is_tablet` - 平板设备标志
- `is_pc` - PC标志
- `is_bot` - 机器人标志
- `expires_at` - 到期日期
- `is_active` - 活动状态
</div>
