const { Client } = require('pg');

async function testDB() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'M_asdf_321',
    database: 'online_judge'
  });

  try {
    console.log('🔍 Testing database connection...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Test query
    const result = await client.query('SELECT COUNT(*) as user_count FROM users');
    console.log(`📊 Users in database: ${result.rows[0].user_count}`);

    // Test auth
    const authResult = await client.query('SELECT * FROM users WHERE username = $1', ['admin']);
    if (authResult.rows.length > 0) {
      console.log('✅ Admin user exists');
      console.log('   Username:', authResult.rows[0].username);
      console.log('   Role:', authResult.rows[0].role);
    } else {
      console.log('❌ Admin user not found');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

testDB();



