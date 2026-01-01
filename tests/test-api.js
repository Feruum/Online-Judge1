const axios = require('axios');

async function testAPI() {
  console.log('🔍 Тестирование API...\n');

  try {
    const response = await axios.get('http://localhost:3001/api/problems');
    console.log('✅ Backend API работает!');
    console.log(`📊 Найдено задач: ${response.data.length}`);
  } catch (error) {
    console.log('❌ Backend API не работает:', error.message);
  }

  try {
    const response = await axios.get('http://localhost:2358/languages');
    console.log('✅ Judge0 API работает!');
    console.log(`📊 Доступно языков: ${response.data.length}`);
  } catch (error) {
    console.log('❌ Judge0 API не работает:', error.message);
  }
}

testAPI();


