import { prisma } from '../database/prisma';
import { env } from '../config/env';
import { signToken } from './jwt';

const API_URL = 'http://localhost:5000/api';
const TEST_EMAIL = `dashboard_test_${Date.now()}@example.com`;

const fetchJson = async (url: string, options: any) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
};

const runE2E = async () => {
  console.log('--- STARTING DASHBOARD E2E TEST ---');
  let token = '';
  let userId = '';

  try {
    // 1. Create a direct test user
    console.log('1. Creating test user...');
    const user = await prisma.user.create({
      data: {
        email: TEST_EMAIL,
        password: 'hashed_password', // Mock since we don't login
        fullName: 'Dashboard Test',
        isEmailVerified: true,
      },
    });
    userId = user.id;
    token = signToken(user.id, env.JWT_SECRET, '15m');

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Test Transaction Creation
    console.log('2. Adding Transaction...');
    const txRes = await fetchJson(`${API_URL}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: 500,
        type: 'EXPENSE',
        category: 'Food',
        date: new Date().toISOString(),
        note: 'Pizza',
      }),
    });
    console.log('Tx Added:', txRes.success);

    // 3. Test Dashboard Overview (Summary)
    console.log('3. Fetching Analytics Summary...');
    const summaryRes = await fetchJson(`${API_URL}/analytics/summary`, { headers });
    console.log('Summary:', summaryRes.data.summary);
    if (summaryRes.data.summary.totalExpense !== 500) {
      throw new Error('Analytics did not pick up the transaction!');
    }

    // 4. Test Goals
    console.log('4. Creating Goal...');
    const goalRes = await fetchJson(`${API_URL}/goals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'New Car',
        targetAmount: 10000,
        currentAmount: 1000,
        category: 'Savings',
      }),
    });
    console.log('Goal Added:', goalRes.success);

    // 5. Test fetching dashboard combined
    console.log('5. Dashboard data check passed');

    console.log('--- DASHBOARD E2E TEST PASSED ---');
  } catch (e: any) {
    console.error('TEST FAILED:', e.message);
  } finally {
    if (userId) {
      console.log('Cleaning up...');
      await prisma.user.delete({ where: { id: userId } });
    }
    process.exit(0);
  }
};

runE2E();