const axios = require('axios');

async function testApiLogin() {
  try {
    console.log('🔍 ТЕСТИРОВАНИЕ API ЛОГИНА:\n');

    const response = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });

    console.log('✅ Логин успешен!');
    console.log('📋 Ответ:', {
      user: response.data.user,
      tokenLength: response.data.token.length
    });

  } catch (error) {
    console.log('❌ Ошибка логина:');
    if (error.response) {
      console.log('   Статус:', error.response.status);
      console.log('   Сообщение:', error.response.data);
    } else {
      console.log('   Ошибка сети:', error.message);
    }
  }
}

testApiLogin();


