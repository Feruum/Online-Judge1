const axios = require('axios');

async function testBackendDatabase() {
  try {
    console.log('🔍 ТЕСТИРОВАНИЕ ПОДКЛЮЧЕНИЯ BACKEND К БАЗЕ ДАННЫХ:\n');

    // Тестируем простой GET запрос к API
    console.log('1. Тестируем доступность API...');
    const healthResponse = await axios.get('http://localhost:3001/api/problems');
    console.log('✅ API доступен, получено', healthResponse.data.length, 'проблем');

    // Тестируем регистрацию нового пользователя
    console.log('\n2. Тестируем регистрацию нового пользователя...');
    try {
      const registerResponse = await axios.post('http://localhost:3001/api/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });
      console.log('✅ Регистрация успешна:', registerResponse.data.user.username);
    } catch (error) {
      console.log('❌ Ошибка регистрации:', error.response?.data?.message || error.message);
    }

    // Тестируем логин существующего пользователя
    console.log('\n3. Тестируем логин существующего пользователя...');
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        username: 'admin',
        password: 'admin123'
      });
      console.log('✅ Логин успешен:', loginResponse.data.user.username, loginResponse.data.user.role);
    } catch (error) {
      console.log('❌ Ошибка логина:', error.response?.data?.message || error.message);
      console.log('   Статус:', error.response?.status);

      // Попробуем другие возможные комбинации
      console.log('\n4. Пробуем другие пароли...');
      const passwordsToTry = ['admin', 'password', '123456'];

      for (const pwd of passwordsToTry) {
        try {
          const response = await axios.post('http://localhost:3001/api/auth/login', {
            username: 'admin',
            password: pwd
          });
          console.log(`✅ Пароль "${pwd}" работает!`);
          break;
        } catch (e) {
          console.log(`❌ Пароль "${pwd}" не работает`);
        }
      }
    }

  } catch (error) {
    console.log('❌ Ошибка подключения к API:', error.message);
  }
}

testBackendDatabase();


