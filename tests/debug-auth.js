const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function debugAuth() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'M_asdf_321',
    database: 'online_judge'
  });

  try {
    console.log('🔍 ДЕТАЛЬНАЯ ПРОВЕРКА АУТЕНТИФИКАЦИИ:\n');

    await client.connect();

    // Получаем ВСЕХ пользователей admin
    const result = await client.query(`
      SELECT id, username, password_hash, role, created_at
      FROM users
      WHERE username = 'admin'
      ORDER BY id
    `);

    console.log(`Найдено ${result.rows.length} пользователей с именем 'admin':`);
    result.rows.forEach((user, index) => {
      console.log(`\n👤 Пользователь ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.created_at}`);
      console.log(`   Password hash length: ${user.password_hash.length}`);
    });

    // Тестируем каждый хэш
    for (const user of result.rows) {
      console.log(`\n🔐 Тестирование пароля для пользователя ID ${user.id}:`);

      const testPasswords = ['admin123', 'admin', 'password', '123456'];

      for (const pwd of testPasswords) {
        try {
          const isValid = await bcrypt.compare(pwd, user.password_hash);
          if (isValid) {
            console.log(`   ✅ Пароль "${pwd}" корректен`);
          } else {
            console.log(`   ❌ Пароль "${pwd}" не корректен`);
          }
        } catch (error) {
          console.log(`   💥 Ошибка при проверке пароля "${pwd}":`, error.message);
        }
      }
    }

    // Проверяем, есть ли другие пользователи
    const allUsers = await client.query(`
      SELECT id, username, email, role
      FROM users
      ORDER BY id
    `);

    console.log(`\n📋 Все пользователи в системе (${allUsers.rows.length}):`);
    allUsers.rows.forEach(user => {
      console.log(`   ${user.id}: ${user.username} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
  } finally {
    await client.end();
  }
}

debugAuth();


