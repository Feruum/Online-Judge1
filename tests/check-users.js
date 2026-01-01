const { Client } = require('pg');

async function checkUsers() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'M_asdf_321',
    database: 'online_judge'
  });

  try {
    console.log('🔍 ПРОВЕРКА ПОЛЬЗОВАТЕЛЕЙ В БАЗЕ ДАННЫХ:\n');

    await client.connect();

    const result = await client.query(`
      SELECT id, username, email, role, created_at
      FROM users
      ORDER BY id
    `);

    if (result.rows.length === 0) {
      console.log('❌ В базе данных нет пользователей');
      console.log('💡 Рекомендуется запустить: node reset-database.js');
    } else {
      console.log(`✅ Найдено ${result.rows.length} пользователей:`);
      result.rows.forEach(user => {
        console.log(`   ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
      });
    }

  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();


