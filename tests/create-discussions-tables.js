const { Client } = require('pg');

async function createTables() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'M_asdf_321',
    database: 'online_judge'
  });

  try {
    console.log('🛠️ СОЗДАНИЕ ТАБЛИЦ ОБСУЖДЕНИЙ...\n');

    await client.connect();

    // Создание таблицы discussions
    console.log('📋 Создание таблицы discussions...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS discussions (
        id SERIAL PRIMARY KEY,
        problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES discussions(id) ON DELETE CASCADE,
        votes INTEGER NOT NULL DEFAULT 0,
        is_answer BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Создание таблицы discussion_votes
    console.log('📋 Создание таблицы discussion_votes...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS discussion_votes (
        id SERIAL PRIMARY KEY,
        discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vote_type INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('✅ Таблицы discussions и discussion_votes созданы успешно!');

  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
  } finally {
    await client.end();
  }
}

createTables();




