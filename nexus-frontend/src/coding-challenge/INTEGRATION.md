# Backend Integration Guide

## Обзор

Frontend интегрирован с NestJS backend, который использует Judge0 для выполнения кода.

## API Endpoints

### Base URL
По умолчанию: `http://localhost:3000/api`

Можно настроить через переменную окружения:
```env
VITE_API_URL=http://localhost:3000/api
```

### Endpoints

#### Problems
- `GET /api/problems` - Получить список всех задач
- `GET /api/problems/:id` - Получить задачу по ID

#### Submissions
- `POST /api/submissions` - Отправить решение (требует JWT)
  ```json
  {
    "problemId": 1,
    "code": "your code here",
    "language": "python" // или "cpp"
  }
  ```
- `GET /api/submissions` - Получить все мои решения (требует JWT)
- `GET /api/submissions/:id` - Получить решение по ID (требует JWT)

#### Auth
- `POST /api/auth/login` - Войти
- `POST /api/auth/register` - Зарегистрироваться

## Аутентификация

JWT токен автоматически сохраняется в localStorage и добавляется к каждому запросу через `Authorization: Bearer <token>` header.

```typescript
import { login, logout, isAuthenticated } from '@/coding-challenge/services/authService';

// Войти
await login('username', 'password');

// Выйти
logout();

// Проверить авторизацию
if (isAuthenticated()) {
  // пользователь авторизован
}
```

## Маппинг языков

Backend поддерживает только `python` и `cpp`, поэтому:
- `javascript` → маппится в `python` (fallback)
- `python` → `python`
- `java` → маппится в `cpp` (fallback)

## Использование

### Получение задачи

```typescript
import { getProblem } from '@/coding-challenge/services/problemService';

const problem = await getProblem(1);
```

### Выполнение кода

```typescript
import { executeCode } from '@/coding-challenge/services/executionService';

const result = await executeCode(
  code,
  'python',
  testInput,
  problemId
);
```

### Отправка решения

```typescript
import { submitSolution } from '@/coding-challenge/services/executionService';

const result = await submitSolution(
  code,
  'python',
  problemId
);
```

## Fallback на Mock

Если API недоступен, автоматически используется mock данные для демонстрации функциональности.

## Статусы Submission

- `pending` - Ожидает выполнения
- `running` - Выполняется
- `accepted` - Принято (правильный ответ)
- `wrong_answer` - Неправильный ответ
- `time_limit_exceeded` - Превышено время
- `memory_limit_exceeded` - Превышена память
- `compilation_error` - Ошибка компиляции
- `runtime_error` - Ошибка выполнения

## Настройка

1. Убедитесь, что backend запущен на `http://localhost:3000`
2. Создайте `.env` файл в `nexus-frontend/`:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
3. Перезапустите dev server

## Troubleshooting

### CORS ошибки
Убедитесь, что backend имеет CORS включен (уже включен в `main.ts`).

### 401 Unauthorized
Убедитесь, что пользователь авторизован:
```typescript
import { apiClient } from '@/coding-challenge/services/apiClient';
apiClient.setToken('your-jwt-token');
```

### API недоступен
Frontend автоматически переключится на mock данные для демонстрации.







