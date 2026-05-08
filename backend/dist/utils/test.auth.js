"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../database/prisma");
const redis_1 = __importDefault(require("../cache/redis"));
const API_URL = 'http://localhost:5000/api/auth';
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const fetchJson = async (url, body) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(JSON.stringify(data));
    return data;
};
const runE2E = async () => {
    console.log('--- STARTING E2E AUTH TEST ---');
    try {
        // Clean up before test just in case
        await prisma_1.prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
        console.log(`1. Testing Register with ${TEST_EMAIL}`);
        const registerRes = await fetchJson(`${API_URL}/register`, {
            fullName: 'Test User',
            email: TEST_EMAIL,
            phone: '', // empty phone to test the previous bug
            password: 'password123',
        });
        console.log('Register response:', registerRes);
        console.log('2. Checking Redis for OTP & User Data');
        const otp = await redis_1.default.get(`otp:${TEST_EMAIL}`);
        const pendingUser = await redis_1.default.get(`pending_user:${TEST_EMAIL}`);
        console.log('OTP in Redis:', otp);
        console.log('Pending User in Redis:', pendingUser);
        if (!otp)
            throw new Error('OTP not found in Redis!');
        console.log('3. Checking that User is NOT in Database yet');
        const dbUserBefore = await prisma_1.prisma.user.findUnique({ where: { email: TEST_EMAIL } });
        if (dbUserBefore)
            throw new Error('User was created before verification! BUG!');
        console.log('Success: User is not in DB.');
        console.log('4. Testing OTP Verification');
        const verifyRes = await fetchJson(`${API_URL}/verify-otp`, {
            email: TEST_EMAIL,
            otp: otp,
        });
        console.log('Verify response:', verifyRes);
        console.log('5. Checking that User IS in Database now');
        const dbUserAfter = await prisma_1.prisma.user.findUnique({ where: { email: TEST_EMAIL } });
        if (!dbUserAfter)
            throw new Error('User was NOT created after verification! BUG!');
        console.log('Success: User is in DB.', dbUserAfter.id);
        console.log('6. Testing Login');
        const loginRes = await fetchJson(`${API_URL}/login`, {
            email: TEST_EMAIL,
            password: 'password123',
        });
        console.log('Login response:', loginRes);
        // Clean up
        console.log('7. Cleaning up test user');
        await prisma_1.prisma.user.delete({ where: { id: dbUserAfter.id } });
        console.log('--- E2E AUTH TEST PASSED ---');
        process.exit(0);
    }
    catch (err) {
        console.error('E2E TEST FAILED:', err.message);
        process.exit(1);
    }
};
runE2E();
