const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function testLogin() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'M_asdf_321',
    database: 'online_judge'
  });

  try {
    console.log('🔐 ТЕСТИРОВАНИЕ АУТЕНТИФИКАЦИИ:\n');

    await client.connect();

    // Получаем данные админа
    const result = await client.query(`
      SELECT id, username, password_hash, role
      FROM users
      WHERE username = 'admin'
    `);

    if (result.rows.length === 0) {
      console.log('❌ Пользователь admin не найден');
      return;
    }

    const user = result.rows[0];
    console.log(`✅ Найден пользователь: ${user.username}, Role: ${user.role}`);

    // Тестируем пароль admin123
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, user.password_hash);

    if (isValid) {
      console.log('✅ Пароль admin123 корректен');
    } else {
      console.log('❌ Пароль admin123 НЕ корректен');

      // Попробуем другие возможные пароли
      const possiblePasswords = ['admin', 'password', '123456', 'admin123!'];

      for (const pwd of possiblePasswords) {
        const isValidPwd = await bcrypt.compare(pwd, user.password_hash);
        if (isValidPwd) {
          console.log(`💡 Найден корректный пароль: ${pwd}`);
          break;
        }
      }
    }

  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
  } finally {
    await client.end();
  }
}

testLogin();


