const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5433,
  user: 'postgres',
  password: 'M_asdf_321',
  database: 'online_judge'
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    await client.connect();
    console.log('✅ Connected to database');

    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);

    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    console.log('📋 Existing tables:', tables.rows.map(r => r.table_name));

    await client.end();
    console.log('✅ Database test completed successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
