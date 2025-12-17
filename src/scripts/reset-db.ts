import { db } from '../database/database.config';
import { users, problems, submissions, votes } from '../database/schema';
import { sql } from 'drizzle-orm';

/**
 * Скрипт для полной очистки базы данных
 * ВНИМАНИЕ: Удаляет ВСЕ данные!
 */
async function resetDatabase() {
  console.log('🗑️  Начинаем очистку базы данных...\n');

  try {
    // Удаление всех данных (в правильном порядке из-за foreign keys)
    console.log('Удаление голосов...');
    await db.delete(votes);
    
    console.log('Удаление решений...');
    await db.delete(submissions);
    
    console.log('Удаление задач...');
    await db.delete(problems);
    
    console.log('Удаление пользователей...');
    await db.delete(users);

    // Сброс автоинкремента
    console.log('\n🔄 Сброс автоинкремента ID...');
    await db.execute(sql`ALTER SEQUENCE votes_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE submissions_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE problems_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);

    // Проверка
    console.log('\n✅ База данных очищена!\n');
    
    const usersCount = await db.select().from(users);
    const problemsCount = await db.select().from(problems);
    const submissionsCount = await db.select().from(submissions);
    const votesCount = await db.select().from(votes);

    console.log('📊 Статистика:');
    console.log(`   Пользователей: ${usersCount.length}`);
    console.log(`   Задач: ${problemsCount.length}`);
    console.log(`   Решений: ${submissionsCount.length}`);
    console.log(`   Голосов: ${votesCount.length}`);
    console.log('\n🎉 Готово! Теперь можно заново зарегистрировать пользователей.\n');

  } catch (error) {
    console.error('❌ Ошибка при очистке базы данных:', error);
    process.exit(1);
  }

  process.exit(0);
}

resetDatabase();
