// Тестируем прямой доступ к базе данных через backend
const axios = require('axios');

async function testBackendDirect() {
  try {
    console.log('🔍 ТЕСТИРОВАНИЕ ПРЯМОГО ДОСТУПА BACKEND К БАЗЕ ДАННЫХ:\n');

    // Создаем простой эндпоинт для тестирования (если он существует)
    // Попробуем /api/users/profile, но сначала нужно аутентифицироваться

    // Сначала создадим нового пользователя admin2 и проверим его
    console.log('1. Создаем тестового пользователя...');
    const registerResponse = await axios.post('http://localhost:3001/api/auth/register', {
      username: 'admin2',
      email: 'admin2@example.com',
      password: 'admin123'
    });

    console.log('✅ Пользователь admin2 создан:', registerResponse.data.user.username);

    // Теперь попробуем войти под admin2
    console.log('\n2. Тестируем логин admin2...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin2',
      password: 'admin123'
    });

    console.log('✅ Логин admin2 успешен:', loginResponse.data.user.username);

    // Теперь попробуем admin2 с неправильным паролем
    console.log('\n3. Тестируем admin2 с неправильным паролем...');
    try {
      await axios.post('http://localhost:3001/api/auth/login', {
        username: 'admin2',
        password: 'wrongpassword'
      });
    } catch (error) {
      console.log('✅ Правильно отклонен неправильный пароль:', error.response?.data?.message);
    }

  } catch (error) {
    console.log('❌ Ошибка:', error.response?.data || error.message);
  }
}

testBackendDirect();


