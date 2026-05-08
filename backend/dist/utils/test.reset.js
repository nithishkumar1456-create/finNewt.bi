"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../database/prisma");
const redis_1 = __importDefault(require("../cache/redis"));
const crypto_1 = __importDefault(require("crypto"));
const API_URL = 'http://localhost:5000/api/auth';
const TEST_EMAIL = `reset_test_${Date.now()}@example.com`;
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
    console.log('--- STARTING PASSWORD RESET E2E TEST ---');
    let userId = '';
    try {
        // 1. Create a test user
        console.log(`1. Creating user ${TEST_EMAIL}`);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: TEST_EMAIL,
                fullName: 'Reset Tester',
                password: 'old_password_123',
                isEmailVerified: true,
            }
        });
        userId = user.id;
        // 2. Request Forgot Password
        console.log('2. Requesting forgot password...');
        const forgotRes = await fetchJson(`${API_URL}/forgot-password`, { email: TEST_EMAIL });
        console.log('Forgot Password response:', forgotRes);
        // 3. Manually get the token from Redis (since we can't read the email)
        console.log('3. Extracting token from Redis...');
        const keys = await redis_1.default.keys('password_reset:*');
        let resetToken = '';
        for (const key of keys) {
            const val = await redis_1.default.get(key);
            if (val === userId) {
                // The key is 'password_reset:HASHED_TOKEN'
                // But we need the RAW token. Wait, our logic stores HASHED token.
                // We can't easily reverse it.
                // Let's modify the test to simulate the link by finding the key.
                resetToken = key.split(':')[1];
                break;
            }
        }
        if (!resetToken)
            throw new Error('Reset token not found in Redis!');
        console.log('Token found (hashed):', resetToken);
        // 4. Reset Password
        // NOTE: Our resetPassword service expects the RAW token, then it hashes it to find it in Redis.
        // In our test, we'll have to "cheat" and provide a token that hashes to what's in Redis, 
        // OR we can just use the RAW token if we had generated it.
        // Let's actually find the token from the email text or simulate the generation.
        // Actually, I'll just clear Redis and generate a KNOWN token for the test.
        const rawToken = 'test-reset-token-1234567890';
        const testHashedToken = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
        await redis_1.default.set(`password_reset:${testHashedToken}`, userId, 'EX', 60);
        console.log('4. Submitting new password with known token...');
        const resetRes = await fetchJson(`${API_URL}/reset-password`, {
            token: rawToken,
            newPassword: 'new_password_secure_999'
        });
        console.log('Reset Password response:', resetRes);
        // 5. Verify Login with new password
        console.log('5. Verifying login with new password...');
        const loginRes = await fetchJson(`${API_URL}/login`, {
            email: TEST_EMAIL,
            password: 'new_password_secure_999'
        });
        console.log('Login success! User ID:', loginRes.data.user.id);
        // 6. Cleanup
        console.log('6. Cleaning up...');
        await prisma_1.prisma.user.delete({ where: { id: userId } });
        console.log('--- PASSWORD RESET E2E TEST PASSED ---');
        process.exit(0);
    }
    catch (err) {
        console.error('E2E TEST FAILED:', err.message);
        if (userId)
            await prisma_1.prisma.user.delete({ where: { id: userId } }).catch(() => { });
        process.exit(1);
    }
};
runE2E();
