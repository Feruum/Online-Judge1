const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function compareHashes() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'M_asdf_321',
    database: 'online_judge'
  });

  try {
    console.log('🔍 СРАВНЕНИЕ ХЭШЕЙ ПАРОЛЕЙ:\n');

    await client.connect();

    // Получаем данные пользователей
    const result = await client.query(`
      SELECT id, username, password_hash
      FROM users
      WHERE username IN ('admin', 'admin2')
      ORDER BY id
    `);

    console.log('Пользователи в базе данных:');
    result.rows.forEach(user => {
      console.log(`\n👤 ${user.username} (ID: ${user.id}):`);
      console.log(`   Хэш: ${user.password_hash}`);
      console.log(`   Длина хэша: ${user.password_hash.length}`);
    });

    // Тестируем каждый хэш
    for (const user of result.rows) {
      console.log(`\n🔐 Тестирование ${user.username}:`);

      const testPassword = 'admin123';
      try {
        const isValid = await bcrypt.compare(testPassword, user.password_hash);
        if (isValid) {
          console.log(`   ✅ Пароль "${testPassword}" корректен`);
        } else {
          console.log(`   ❌ Пароль "${testPassword}" НЕ корректен`);

          // Попробуем проверить хэш другими способами
          console.log('   Детали хэша:');
          console.log('   - Начинается с $2: ', user.password_hash.startsWith('$2'));
          console.log('   - Содержит точки: ', user.password_hash.includes('.'));
        }
      } catch (error) {
        console.log(`   💥 Ошибка при проверке: ${error.message}`);
      }
    }

    // Проверим, может ли bcrypt вообще создать правильный хэш
    console.log('\n🔧 Тестирование создания нового хэша:');
    const saltRounds = 10;
    const newHash = await bcrypt.hash('admin123', saltRounds);
    console.log('Новый хэш для admin123:', newHash);

    const isNewHashValid = await bcrypt.compare('admin123', newHash);
    console.log('Новый хэш валиден:', isNewHashValid);

  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
  } finally {
    await client.end();
  }
}

compareHashes();


