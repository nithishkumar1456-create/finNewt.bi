"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../database/prisma");
const env_1 = require("../config/env");
const jwt_1 = require("./jwt");
const API_URL = 'http://localhost:5000/api';
const TEST_EMAIL = `goals_test_${Date.now()}@example.com`;
const fetchJson = async (url, options) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(JSON.stringify(data));
    return data;
};
const runE2E = async () => {
    console.log('--- STARTING GOAL SYSTEM E2E TEST ---');
    let token = '';
    let userId = '';
    let goalId = '';
    try {
        console.log('1. Creating test user...');
        const user = await prisma_1.prisma.user.create({
            data: {
                email: TEST_EMAIL,
                password: 'hashed_password',
                fullName: 'Goal Tester',
                isEmailVerified: true,
            },
        });
        userId = user.id;
        token = (0, jwt_1.signToken)(user.id, env_1.env.JWT_SECRET, '15m');
        const headers = { Authorization: `Bearer ${token}` };
        console.log('2. Creating a new goal...');
        const createRes = await fetchJson(`${API_URL}/goals`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                title: 'Vacation',
                targetAmount: 5000,
                currentAmount: 1000,
                category: 'Travel'
            })
        });
        goalId = createRes.data.goal.id;
        console.log(`Goal Created: ${createRes.data.goal.title} - Status: ${createRes.data.goal.status}`);
        console.log('3. Adding funds to goal...');
        const addFundsRes = await fetchJson(`${API_URL}/goals/${goalId}/add-funds`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ amount: 2000 })
        });
        console.log(`Current Amount: ${addFundsRes.data.goal.currentAmount}`);
        if (Number(addFundsRes.data.goal.currentAmount) !== 3000)
            throw new Error('Add funds math failed!');
        console.log('4. Editing the goal (completing it)...');
        const editRes = await fetchJson(`${API_URL}/goals/${goalId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                currentAmount: 5000
            })
        });
        console.log(`New Status: ${editRes.data.goal.status}`);
        if (editRes.data.goal.status !== 'completed')
            throw new Error('Goal status completion logic failed!');
        console.log('5. Deleting the goal...');
        const delRes = await fetchJson(`${API_URL}/goals/${goalId}`, {
            method: 'DELETE',
            headers,
        });
        console.log(`Delete successful: ${delRes.success}`);
        console.log('--- GOAL SYSTEM E2E TEST PASSED ---');
    }
    catch (e) {
        console.error('TEST FAILED:', e.message);
    }
    finally {
        if (userId) {
            console.log('Cleaning up...');
            await prisma_1.prisma.user.delete({ where: { id: userId } });
        }
        process.exit(0);
    }
};
runE2E();
