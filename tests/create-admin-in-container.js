const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function createAdminInContainer() {
  console.log('🔍 СОЗДАНИЕ АДМИНА В КОНТЕЙНЕРЕ:\n');

  const client = new Client({
    host: 'postgres',
    port: 5432,
    user: 'postgres',
    password: 'M_asdf_321',
    database: 'online_judge'
  });

  try {
    await client.connect();
    console.log('✅ Подключение к БД успешно');

    // Проверяем, существует ли уже пользователь admin
    const existingAdmin = await client.query('SELECT id FROM users WHERE username = $1', ['admin']);
    if (existingAdmin.rows.length > 0) {
      console.log('⚠️ Пользователь admin уже существует');
      return;
    }

    // Создаем хэш пароля
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('admin123', saltRounds);
    console.log('✅ Хэш пароля создан');

    // Создаем пользователя admin
    await client.query(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
    `, ['admin', 'admin@judge.com', passwordHash, 'admin']);

    console.log('✅ Пользователь admin создан');

    // Проверяем
    const result = await client.query('SELECT id, username, role FROM users WHERE username = $1', ['admin']);
    console.log('Пользователь создан:', result.rows[0]);

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
  }
}

createAdminInContainer();


