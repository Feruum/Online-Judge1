# 📮 Postman Instructions - Online Judge API

## 🚀 Быстрый старт

### 1️⃣ **Импорт коллекции**
```
File → Import → Upload Files → Выберите postman-collection.json
```

### 2️⃣ **Настройка переменных**
```
В коллекции "Online Judge API":
- base_url: http://localhost:3000/api
- user_token: (заполнится автоматически)
- admin_token: (заполнится автоматически)
- problem_id: 1 (или ID созданной задачи)
- submission_id: 1 (или ID отправленного решения)
```

### 3️⃣ **Запуск тестов**
```
Runner → Выберите коллекцию → Run
```

---

## 📋 ПОЛНЫЙ СПИСОК ЗАПРОСОВ

### 🔐 **Authentication**
```
POST /auth/register
POST /auth/login
```

### 📝 **Problems**
```
GET /problems              - Получить все задачи
GET /problems/{id}         - Получить задачу по ID
POST /problems             - Создать задачу (admin only)
```

### 💻 **Submissions**
```
POST /submissions           - Отправить решение
GET /submissions            - Мои решения
PATCH /submissions/{id}/public - Сделать публичным
```

### 🗳️ **Voting**
```
POST /votes                 - Проголосовать
GET /votes/problems/{id}/top-solutions - Лучшие решения
```

---

## 🎯 **ТИПИЧНЫЙ СЦЕНАРИЙ ИСПОЛЬЗОВАНИЯ**

### **1. Регистрация и вход**
```javascript
POST /auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```
→ Сохранить `token` из ответа

### **2. Создание задачи (админ)**
```javascript
POST /problems
Headers: Authorization: Bearer {admin_token}
{
  "title": "Two Sum",
  "description": "Найти два числа, дающих сумму target",
  "testCases": [
    {"input": "2 7 11 15\n9", "expectedOutput": "[0,1]"},
    {"input": "3 2 4\n6", "expectedOutput": "[1,2]"}
  ]
}
```

### **3. Отправка решения**
```javascript
POST /submissions
Headers: Authorization: Bearer {user_token}
{
  "problemId": 1,
  "code": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n}",
  "language": "cpp"
}
```

### **4. Проверка статуса**
```javascript
GET /submissions
Headers: Authorization: Bearer {user_token}
```
→ Проверить `status` отправленного решения

### **5. Голосование**
```javascript
POST /votes
Headers: Authorization: Bearer {user_token}
{
  "submissionId": 1,
  "voteType": "best_practice"
}
```

---

## 🔍 **МОНИТОРИНГ И ДЕБАГ**

### **Проверка Judge0**
```bash
curl http://localhost:2358/languages
```

### **Проверка базы данных**
```bash
docker logs online-judge-postgres
```

### **Проверка очередей**
```bash
docker exec -it online-judge-redis redis-cli
> KEYS *
> LLEN submissions
```

### **Логи приложения**
```bash
# Логи NestJS
tail -f logs/application.log

# Логи очередей
tail -f logs/queue.log
```

---

## 🧪 **АВТОМАТИЧЕСКИЕ ТЕСТЫ**

```bash
# Полный интеграционный тест
node test-full-integration.js

# Тест ошибок
node test-wrong-solution.js

# Тест Judge0
node test-judge0-real.js
```

---

## 🚨 **ВОЗМОЖНЫЕ ПРОБЛЕМЫ**

### **403 Forbidden**
- Проверить JWT токен
- Убедиться, что пользователь имеет нужные права

### **500 Internal Server Error**
- Проверить логи NestJS
- Проверить подключение к БД

### **Timeout на submission**
- Проверить Judge0: `curl http://localhost:2358/languages`
- Проверить Redis: `docker ps`

### **Wrong Answer вместо Accepted**
- Проверить тестовые случаи в задаче
- Проверить формат вывода (с `\n`)

---

## 🎊 **ГОТОВО К ИСПОЛЬЗОВАНИЮ!**

Коллекция Postman полностью настроена для тестирования всех функций Online Judge с реальным Judge0! 🚀
