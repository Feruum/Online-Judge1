const { Client } = require('pg');
const axios = require('axios');
const redis = require('redis');

async function checkSystem() {
  console.log('🔍 ПРОВЕРКА СТАТУСА СИСТЕМЫ:\n');

  try {
    // PostgreSQL
    const client = new Client({
      host: 'localhost',
      port: 5432,  // Изменено на стандартный порт PostgreSQL
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

  try {
    // Redis
    const redisClient = redis.createClient({ host: 'localhost', port: 6379 });
    await new Promise((resolve, reject) => {
      redisClient.on('connect', () => {
        console.log('✅ Redis: работает');
        redisClient.quit();
        resolve();
      });
      redisClient.on('error', reject);
      setTimeout(() => reject(new Error('Timeout')), 2000);
    });
  } catch (e) {
    console.log('❌ Redis:', e.message);
  }

  try {
    // Judge0
    const response = await axios.get('http://localhost:2358/languages');
    console.log('✅ Judge0: работает (' + response.data.length + ' языков)');
  } catch (e) {
    console.log('❌ Judge0:', e.message);
  }

  try {
    // NestJS API
    const response = await axios.get('http://localhost:3000/api/problems');
    console.log('✅ NestJS API: работает (' + response.data.length + ' задач)');
  } catch (e) {
    console.log('❌ NestJS API:', e.message);
  }

  console.log('\n🎯 ОСНОВНЫЕ ТЕСТЫ:');

  try {
    // Judge0 integration
    const testResponse = await axios.post('http://localhost:2358/submissions', {
      language_id: 54, // C++
      source_code: '#include <bits/stdc++.h>\nusing namespace std;\nint main() { int a, b; cin >> a >> b; cout << (a + b) << endl; return 0; }',
      stdin: '5 3\n'
    });

    if (testResponse.data.token) {
      console.log('✅ Judge0 интеграция: работает');
    }
  } catch (e) {
    console.log('❌ Judge0 интеграция:', e.message);
  }

  console.log('\n🏁 ПРОВЕРКА ЗАВЕРШЕНА');
}

checkSystem();
