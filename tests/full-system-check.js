const axios = require('axios');
const { Client } = require('pg');

async function checkFullSystem() {
  console.log('🔍 ПОЛНАЯ ПРОВЕРКА СИСТЕМЫ:\n');

  // PostgreSQL
  try {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'M_asdf_321',
      database: 'online_judge'
    });

    await client.connect();
    const result = await client.query('SELECT COUNT(*) as users FROM users');
    console.log('✅ PostgreSQL: работает (' + result.rows[0].users + ' пользователей)');
    await client.end();
  } catch (e) {
    console.log('❌ PostgreSQL:', e.message);
  }

  // Redis
  try {
    const response = await axios.get('http://localhost:6379/ping', { timeout: 2000 });
    console.log('✅ Redis: работает');
  } catch (e) {
    console.log('❌ Redis: недоступен напрямую (но может работать через сокет)');
  }

  // Judge0 (на виртуальной машине)
  try {
    const response = await axios.get('http://localhost:2358/languages', { timeout: 5000 });
    console.log('✅ Judge0: работает (' + response.data.length + ' языков)');
  } catch (e) {
    console.log('❌ Judge0:', e.message);
  }

  // NestJS Backend API
  try {
    const response = await axios.get('http://localhost:3001/api/problems');
    console.log('✅ NestJS Backend: работает (' + response.data.length + ' задач)');
  } catch (e) {
    console.log('❌ NestJS Backend:', e.message);
  }

  // Frontend
  try {
    const response = await axios.get('http://localhost:3000', { timeout: 5000 });
    if (response.status === 200) {
      console.log('✅ Frontend: работает');
    } else {
      console.log('⚠️ Frontend: отвечает с кодом', response.status);
    }
  } catch (e) {
    console.log('❌ Frontend:', e.message);
  }

  // Тест Judge0 интеграции
  console.log('\n🎯 ТЕСТИРОВАНИЕ ИНТЕГРАЦИИ:');
  try {
    const testResponse = await axios.post('http://localhost:2358/submissions', {
      language_id: 54, // C++
      source_code: '#include <bits/stdc++.h>\nusing namespace std;\nint main() { int a, b; cin >> a >> b; cout << (a + b) << endl; return 0; }',
      stdin: '5 3\n'
    }, { timeout: 5000 });

    if (testResponse.data.token) {
      console.log('✅ Judge0 интеграция: работает');
    }
  } catch (e) {
    console.log('❌ Judge0 интеграция:', e.message);
  }

  console.log('\n🏁 ПРОВЕРКА ЗАВЕРШЕНА');
  console.log('\n🌐 ДОСТУПНЫЕ СЕРВИСЫ:');
  console.log('  • Frontend: http://localhost:3000');
  console.log('  • Backend API: http://localhost:3001');
  console.log('  • Judge0 API: http://localhost:2358');
}

checkFullSystem().catch(console.error);


