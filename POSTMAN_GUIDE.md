# 📮 ПОЛНОЕ РУКОВОДСТВО ПО POSTMAN

## 🚀 1. ИМПОРТ КОЛЛЕКЦИИ

1. **Открыть Postman**
2. **File → Import → Upload Files**
3. **Выбрать файл:** `tests/postman-collection.json`
4. **Нажать Import**

## ⚙️ 2. НАСТРОЙКА ПЕРЕМЕННЫХ

В коллекции "Online Judge API" установить переменные:

```json
{
  "base_url": "http://localhost:3000/api",
  "user_token": "",
  "admin_token": "",
  "problem_id": "1",
  "submission_id": "1"
}
```

### 🔑 ПОЛУЧЕНИЕ ТОКЕНОВ

**Получить токен админа:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Скопировать `token` из ответа в переменную `admin_token`

---

## 🎯 3. ПОЛНЫЕ ПРИМЕРЫ ЗАПРОСОВ

### 📝 1. РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ

**Method:** POST
**URL:** `{{base_url}}/auth/register`
**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Ответ:**

```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🔐 2. ВХОД В СИСТЕМУ

**Method:** POST
**URL:** `{{base_url}}/auth/login`
**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Ответ:**

```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 📋 3. ПОЛУЧЕНИЕ СПИСКА ЗАДАЧ

**Method:** GET
**URL:** `{{base_url}}/problems`

**Ответ:**

```json
[
  {
    "id": 1,
    "title": "Two Sum",
    "description": "Find two numbers that add up to target",
    "createdAt": "2025-12-17T15:30:00.000Z"
  }
]
```

---

### 📝 4. СОЗДАНИЕ ЗАДАЧИ (ТОЛЬКО АДМИН)

**Method:** POST
**URL:** `{{base_url}}/problems`
**Headers:**

```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body:**

```json
{
  "title": "Sum of Two Numbers",
  "description": "Write a program that reads two integers and prints their sum.",
  "testCases": [
    {
      "input": "5 3\n",
      "expectedOutput": "8\n"
    },
    {
      "input": "10 20\n",
      "expectedOutput": "30\n"
    },
    {
      "input": "0 0\n",
      "expectedOutput": "0\n"
    }
  ]
}
```

**Ответ:**

```json
{
  "id": 1,
  "title": "Sum of Two Numbers",
  "description": "Write a program that reads two integers and prints their sum.",
  "testCases": [
    {
      "input": "5 3\n",
      "expectedOutput": "8\n"
    }
  ]
}
```

---

### 💻 5. ОТПРАВКА РЕШЕНИЯ

**Method:** POST
**URL:** `{{base_url}}/submissions`
**Headers:**

```
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

**Body:**

```json
{
  "problemId": 1,
  "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << (a + b) << endl;\n    return 0;\n}",
  "language": "cpp"
}
```

**Ответ:**

```json
{
  "id": 1,
  "userId": 1,
  "problemId": 1,
  "code": "#include <bits/stdc++.h>...",
  "language": "cpp",
  "status": "pending",
  "createdAt": "2025-12-17T15:45:00.000Z"
}
```

---

### 📊 6. ПРОВЕРКА СТАТУСА РЕШЕНИЙ

**Method:** GET
**URL:** `{{base_url}}/submissions`
**Headers:**

```
Authorization: Bearer {{user_token}}
```

**Ответ:**

```json
[
  {
    "id": 1,
    "status": "accepted",
    "language": "cpp",
    "votes": 0,
    "isPublic": false,
    "createdAt": "2025-12-17T15:45:00.000Z"
  }
]
```

---

### 🌟 7. ПУБЛИКАЦИЯ РЕШЕНИЯ

**Method:** PATCH
**URL:** `{{base_url}}/submissions/{{submission_id}}/public`
**Headers:**

```
Authorization: Bearer {{user_token}}
```

**Ответ:**

```json
{
  "message": "Solution published successfully"
}
```

---

### 🗳️ 8. ГОЛОСОВАНИЕ ЗА РЕШЕНИЕ

**Method:** POST
**URL:** `{{base_url}}/votes`
**Headers:**

```
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

**Body:**

```json
{
  "submissionId": 1,
  "voteType": "best_practice"
}
```

**Ответ:**

```json
{
  "id": 1,
  "submissionId": 1,
  "userId": 1,
  "voteType": "best_practice",
  "createdAt": "2025-12-17T15:50:00.000Z"
}
```

---

### 🏆 9. ПРОСМОТР ТОП РЕШЕНИЙ

**Method:** GET
**URL:** `{{base_url}}/votes/problems/{{problem_id}}/top-solutions`
**Headers:**

```
Authorization: Bearer {{user_token}}
```

**Ответ:**

```json
[
  {
    "id": 1,
    "code": "#include <bits/stdc++.h>...",
    "language": "cpp",
    "votes": 1,
    "author": "testuser"
  }
]
```

---

## 🔄 АВТОМАТИЧЕСКОЕ ТЕСТИРОВАНИЕ

### Запуск всех тестов:

1. **Открыть Runner:** Runner → Выбрать коллекцию
2. **Нажать Run**
3. **Посмотреть результаты**

### Ручной запуск тестов:

```bash
# Полный интеграционный тест
node tests/test-full-integration.js

# Тест с ошибками
node tests/test-wrong-solution.js
```

---

## 🧪 ТЕСТИРОВАНИЕ РАЗЛИЧНЫХ СЦЕНАРИЕВ

### ✅ ТЕСТ ПРАВИЛЬНОГО РЕШЕНИЯ

**C++ код:**

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << (a + b) << endl;
    return 0;
}
```

**Python код:**

```python
a, b = map(int, input().split())
print(a + b)
```

### ❌ ТЕСТ НЕПРАВИЛЬНОГО РЕШЕНИЯ

**Код с ошибкой:**

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << (a - b) << endl;  // Неправильная операция
    return 0;
}
```

### 💥 ТЕСТ С ОШИБКОЙ ВЫПОЛНЕНИЯ

**Runtime Error:**

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << (a / 0) << endl;  // Деление на ноль
    return 0;
}
```

---

## 🔍 ОТЛАДКА ПРОБЛЕМ

### 401 Unauthorized

```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

**Решение:** Проверить токен JWT

### 403 Forbidden

```json
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

**Решение:** Только админ может создавать задачи

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

**Решение:** Проверить логи NestJS

---

## 📋 ПОЛНЫЙ СЦЕНАРИЙ ТЕСТИРОВАНИЯ

```javascript
// 1. Регистрация админа
POST /auth/register
{
  "username": "admin",
  "email": "admin@judge.com",
  "password": "admin123"
}

// 2. Вход админа
POST /auth/login
{
  "username": "admin",
  "password": "admin123"
}
→ Сохранить admin_token

// 3. Создание задачи
POST /problems
Headers: Bearer {{admin_token}}
{
  "title": "Hello World",
  "description": "Print Hello World",
  "testCases": [{"input": "", "expectedOutput": "Hello World\n"}]
}

// 4. Регистрация пользователя
POST /auth/register
{
  "username": "coder",
  "email": "coder@example.com",
  "password": "code123"
}

// 5. Отправка решения
POST /submissions
Headers: Bearer {{user_token}}
{
  "problemId": 1,
  "code": "print('Hello World')",
  "language": "python"
}

// 6. Ожидание результата
GET /submissions
Headers: Bearer {{user_token}}
→ Проверить status: "accepted"
```

---

## 🎊 ГОТОВО!

Теперь у вас есть **ПОЛНАЯ ИНСТРУКЦИЯ** по работе с Postman для тестирования Online Judge API с реальным выполнением кода через Judge0!

🚀 **Приступайте к тестированию!**
