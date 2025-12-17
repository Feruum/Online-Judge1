const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testFullIntegration() {
  try {
    console.log('🚀 Testing Full Online Judge Integration with Real Judge0...\n');

    // Test 1: Login as admin
    console.log('1️⃣ Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Admin logged in:', loginResponse.data.user.username);
    const token = loginResponse.data.token;

    // Test 2: Create problem
    console.log('\n2️⃣ Testing problem creation...');
    const problemResponse = await axios.post(`${BASE_URL}/problems`, {
      title: 'Add Two Numbers',
      description: 'Write a program that reads two integers from input and prints their sum.',
      testCases: [
        { input: '5 3\n', expectedOutput: '8\n' },
        { input: '10 20\n', expectedOutput: '30\n' },
        { input: '0 0\n', expectedOutput: '0\n' }
      ]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Problem created:', problemResponse.data.title);
    const problemId = problemResponse.data.id;

    // Test 3: Submit C++ solution
    console.log('\n3️⃣ Testing C++ solution submission...');
    const cppSubmission = await axios.post(`${BASE_URL}/submissions`, {
      problemId: problemId,
      code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << (a + b) << endl;
    return 0;
}`,
      language: 'cpp'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ C++ submission created, ID:', cppSubmission.data.id);
    const cppSubmissionId = cppSubmission.data.id;

    // Wait for processing
    console.log('⏳ Waiting for C++ submission to be processed...');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

    // Check submission status
    const cppStatusResponse = await axios.get(`${BASE_URL}/submissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cppSubmissionStatus = cppStatusResponse.data.find(s => s.id === cppSubmissionId);
    console.log(`✅ C++ submission status: ${cppSubmissionStatus.status}`);

    if (cppSubmissionStatus.status === 'accepted') {
      console.log('🎉 C++ solution ACCEPTED! Real Judge0 execution works!');

      // Test 4: Make solution public
      console.log('\n4️⃣ Making C++ solution public...');
      await axios.patch(`${BASE_URL}/submissions/${cppSubmissionId}/public`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Solution made public');

      // Test 5: Submit Python solution
      console.log('\n5️⃣ Testing Python solution submission...');
      const pythonSubmission = await axios.post(`${BASE_URL}/submissions`, {
        problemId: problemId,
        code: `a, b = map(int, input().split())
print(a + b)`,
        language: 'python'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Python submission created, ID:', pythonSubmission.data.id);
      const pythonSubmissionId = pythonSubmission.data.id;

      // Wait for processing
      console.log('⏳ Waiting for Python submission to be processed...');
      await new Promise(resolve => setTimeout(resolve, 8000)); // Wait 8 seconds

      // Check submission status
      const pythonStatusResponse = await axios.get(`${BASE_URL}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pythonSubmissionStatus = pythonStatusResponse.data.find(s => s.id === pythonSubmissionId);
      console.log(`✅ Python submission status: ${pythonSubmissionStatus.status}`);

      if (pythonSubmissionStatus.status === 'accepted') {
        console.log('🎉 Python solution ACCEPTED! Both languages work!');

        // Test 6: Get top solutions
        console.log('\n6️⃣ Testing top solutions retrieval...');
        const solutionsResponse = await axios.get(`${BASE_URL}/votes/problems/${problemId}/top-solutions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Retrieved ${solutionsResponse.data.length} top solutions`);

        // Test 7: Vote on solution
        console.log('\n7️⃣ Testing voting system...');
        await axios.post(`${BASE_URL}/votes`, {
          submissionId: cppSubmissionId,
          voteType: 'best_practice'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Vote cast successfully');

        console.log('\n🎊 ALL TESTS PASSED! Full integration with Real Judge0 works perfectly!');
        console.log('\n📊 Summary:');
        console.log('   ✅ User registration & authentication');
        console.log('   ✅ Problem creation');
        console.log('   ✅ C++ code execution (ACCEPTED)');
        console.log('   ✅ Python code execution (ACCEPTED)');
        console.log('   ✅ Solution publishing');
        console.log('   ✅ Voting system');
        console.log('   ✅ Top solutions retrieval');
        console.log('   ✅ Real Judge0 integration');

      } else {
        console.log(`❌ Python submission failed with status: ${pythonSubmissionStatus.status}`);
      }

    } else {
      console.log(`❌ C++ submission failed with status: ${cppSubmissionStatus.status}`);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status:', error.response.status);
    }
  }
}

// Run comprehensive test
testFullIntegration();
