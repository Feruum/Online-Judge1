# Online Judge - Linux Native Deployment

Это руководство описывает развертывание Online Judge на Linux без использования VirtualBox VM.

## Преимущества Linux развертывания

- 🚀 **Быстрее**: Нет накладных расходов виртуализации
- 🔧 **Проще**: Все сервисы в Docker контейнерах
- 💾 **Экономия места**: Нет отдельной VM
- 🔄 **Легче обновлять**: Простое управление контейнерами

## Быстрый старт

```bash
# 1. Установить зависимости
sudo apt update
sudo apt install docker.io docker-compose git curl

# 2. Клонировать проект
git clone <your-repo>
cd online-judge

# 3. Скопировать переменные окружения
cp env.example .env
# Изменить порт в .env с 5433 на 5432 если нужно

# 4. Запустить все сервисы
chmod +x start.sh
./start.sh
```

## Архитектура

```
┌─────────────────┐    ┌─────────────────┐
│   NestJS API    │    │   PostgreSQL     │
│   localhost:3000 │◄──►│   localhost:5432 │
└─────────────────┘    └─────────────────┘
          │                       │
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│     Judge0      │    │      Redis      │
│  localhost:2358 │◄──►│  localhost:6379 │
└─────────────────┘    └─────────────────┘
```

## Сервисы

### PostgreSQL (порт 5432)
- **База данных приложения**: `online_judge`
- **База данных Judge0**: `judge0`
- **Пользователь**: postgres / M_asdf_321

### Redis (порт 6379)
- Кэширование и очереди BullMQ
- Никаких дополнительных настроек не требуется

### Judge0 (порт 2358)
- Исполнение кода C++ и Python
- Полностью в Docker контейнере
- Использует PostgreSQL и Redis

### NestJS API (порт 3000)
- Основное приложение
- REST API для всех функций платформы

## Команды управления

```bash
# Запуск всех сервисов
./start.sh

# Остановка всех сервисов
docker-compose down

# Перезапуск всех сервисов
docker-compose restart

# Просмотр логов
docker-compose logs -f

# Проверка статуса
node status-check.js

# Сброс базы данных
node reset-database.js
```

## Переменные окружения

```bash
# База данных (локальный PostgreSQL)
DATABASE_URL=postgresql://postgres:M_asdf_321@localhost:5432/online_judge

# Redis (локальный Redis)
REDIS_HOST=localhost
REDIS_PORT=6379

# Judge0 (локальный Judge0 в Docker)
JUDGE0_MOCK=false
JUDGE0_URL=http://localhost:2358

# JWT секрет
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Порт приложения
PORT=3000
```

## Диагностика

### Проверить статус всех сервисов
```bash
node status-check.js
```

### Проверить логи конкретного сервиса
```bash
docker-compose logs postgres
docker-compose logs redis
docker-compose logs judge0
docker-compose logs -f  # все логи в реальном времени
```

### Проверить подключение к Judge0
```bash
curl http://localhost:2358/languages
```

### Подключиться к базе данных
```bash
docker-compose exec postgres psql -U postgres -d online_judge
```

## Миграции и инициализация

После первого запуска все миграции выполняются автоматически скриптом `start.sh`.

Для ручного выполнения миграций:
```bash
npm run db:push
```

## Производственное развертывание

Для production добавьте:

1. **SSL/TLS** сертификаты
2. **Firewall** настройки (открыть только нужные порты)
3. **Backup** стратегию для PostgreSQL
4. **Monitoring** (Prometheus + Grafana)
5. **Load balancer** (nginx)
6. **Environment variables** в Docker secrets

Пример production docker-compose.override.yml:
```yaml
version: '3.8'
services:
  postgres:
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
    secrets:
      - postgres_password

  redis:
    command: redis-server --requirepass $REDIS_PASSWORD

secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
```
