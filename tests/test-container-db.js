const { Client } = require('pg');

async function testContainerDB() {
  console.log('🔍 ТЕСТИРОВАНИЕ ПОДКЛЮЧЕНИЯ К БД ИЗ КОНТЕЙНЕРА:\n');

  // Сначала попробуем подключиться к postgres сервису
  const client = new Client({
    host: 'postgres',
    port: 5432,
    user: 'postgres',
    password: 'M_asdf_321',
    database: 'online_judge'
  });

  try {
    console.log('1. Подключаемся к postgres...');
    await client.connect();
    console.log('✅ Подключение успешно');

    console.log('2. Получаем пользователей...');
    const result = await client.query('SELECT id, username, role FROM users ORDER BY id');
    console.log('Пользователи:', result.rows);

    console.log('3. Проверяем пользователя admin...');
    const adminResult = await client.query('SELECT id, username, password_hash FROM users WHERE username = $1', ['admin']);
    if (adminResult.rows.length > 0) {
      console.log('✅ Пользователь admin найден:', adminResult.rows[0]);
    } else {
      console.log('❌ Пользователь admin не найден');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
  }
}

testContainerDB();


