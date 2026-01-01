const axios = require('axios');

async function testCreateProblem() {
  try {
    console.log('🔍 ТЕСТИРОВАНИЕ СОЗДАНИЯ ПРОБЛЕМЫ:\n');

    // Сначала логинимся как admin
    console.log('1. Логин как admin...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Логин успешен, токен получен');

    // Создаем тестовую проблему
    console.log('\n2. Создание тестовой проблемы...');
    const problemData = {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'Easy',
      slug: 'two-sum',
      examples: JSON.stringify([{
        input: '[2,7,11,15], 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }]),
      testCases: JSON.stringify([{
        input: '[2,7,11,15]\n9',
        output: '[0,1]'
      }]),
      constraints: JSON.stringify([
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ]),
      starterCode: JSON.stringify({
        javascript: 'function twoSum(nums, target) {\n    // Your code here\n}'
      }),
      tags: ['Array', 'Hash Table']
    };

    const createResponse = await axios.post('http://localhost:3001/api/problems', problemData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Проблема создана успешно!');
    console.log('📋 Созданная проблема:', createResponse.data);

  } catch (error) {
    console.log('❌ Ошибка:', error.response?.data || error.message);
    if (error.response) {
      console.log('Статус:', error.response.status);
      console.log('Данные ошибки:', error.response.data);
    }
  }
}

testCreateProblem();


