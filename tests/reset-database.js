const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function resetDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,  // Изменено на стандартный порт PostgreSQL
    user: 'postgres',
    password: 'M_asdf_321',
    database: 'online_judge'
  });

  try {
    console.log('🗑️ ОЧИСТКА БАЗЫ ДАННЫХ...\n');

    await client.connect();

    // Удаление всех данных
    console.log('📋 Удаление данных...');
    await client.query('DELETE FROM discussion_votes CASCADE');
    await client.query('DELETE FROM discussions CASCADE');
    await client.query('DELETE FROM votes CASCADE');
    await client.query('DELETE FROM submissions CASCADE');
    await client.query('DELETE FROM problems CASCADE');
    await client.query('DELETE FROM users CASCADE');

    console.log('✅ Все данные удалены');

    // Сброс автоинкремента
    console.log('🔄 Сброс счетчиков ID...');
    await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE problems_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE submissions_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE votes_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE discussions_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE discussion_votes_id_seq RESTART WITH 1');

    // Создание нового админа
    console.log('👑 Создание администратора...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('admin123', saltRounds);

    await client.query(`
      INSERT INTO users (username, email, "password_hash", role)
      VALUES ($1, $2, $3, $4)
    `, ['admin', 'admin@judge.com', passwordHash, 'admin']);

    console.log('✅ Администратор создан');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: admin');

    console.log('\n🎉 БАЗА ДАННЫХ ПОЛНОСТЬЮ ОЧИЩЕНА И ГОТОВА К ИСПОЛЬЗОВАНИЮ!');

  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
  } finally {
    await client.end();
  }
}

resetDatabase();
