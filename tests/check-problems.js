const axios = require('axios');

async function checkProblems() {
  try {
    console.log('🔍 ПРОВЕРКА СПИСКА ПРОБЛЕМ:\n');

    const response = await axios.get('http://localhost:3001/api/problems');
    console.log('Найдено проблем:', response.data.length);

    response.data.forEach(problem => {
      console.log(`\n📋 Проблема #${problem.id}:`);
      console.log(`   Название: ${problem.title}`);
      console.log(`   Сложность: ${problem.difficulty}`);
      console.log(`   Описание: ${problem.description.substring(0, 100)}...`);
      if (problem.tags && problem.tags.length > 0) {
        console.log(`   Тэги: ${problem.tags.join(', ')}`);
      }
    });

  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}

checkProblems();


