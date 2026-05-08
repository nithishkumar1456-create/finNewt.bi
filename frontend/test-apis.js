import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

async function runTests() {
  try {
    console.log('--- STARTING API TESTS ---');

    // 1. Health
    const health = await api.get('/health');
    console.log('Health:', health.data);

    // 3. Login
    const loginRes = await api.post('/auth/login', {
      email: 'test1778256167815@test.com', // Using the email from the background logs
      password: 'password123'
    });
    console.log('Login:', loginRes.data);
    
    // Extract cookies
    const cookies = loginRes.headers['set-cookie'];
    if (cookies) {
        api.defaults.headers.common['Cookie'] = cookies.join('; ');
    }

    // 4. Create Transaction
    const txRes = await api.post('/transactions', {
      amount: 1000,
      type: 'EXPENSE',
      category: 'Food',
      date: new Date().toISOString(),
      note: 'Dinner'
    });
    console.log('Create Transaction:', txRes.data);
    const txId = txRes.data.data.transaction.id;

    // 5. Fetch Transactions
    const getTxRes = await api.get('/transactions');
    console.log('Get Transactions:', getTxRes.data.data.transactions.length);

    // 6. Create Goal
    const goalRes = await api.post('/goals', {
      title: 'New Car',
      targetAmount: 50000,
      deadline: new Date(Date.now() + 10000000000).toISOString()
    });
    console.log('Create Goal:', goalRes.data);

    // 7. Get Analytics
    const summaryRes = await api.get('/analytics/summary');
    console.log('Analytics Summary:', summaryRes.data);

    console.log('--- ALL TESTS PASSED ---');
  } catch (err) {
    console.error('API Test Error:', err.response ? err.response.data : err.message);
  }
}

runTests();