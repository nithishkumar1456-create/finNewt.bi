import http from 'http';
import app from '../app';
import redis from '../cache/redis';
import { prisma } from '../database/prisma';
import { env } from '../config/env';
import { verifyToken } from '../utils/jwt';

const PORT = Number(process.env.AUTH_TEST_PORT || 5099);
const API_URL = `http://localhost:${PORT}/api`;
const TEST_EMAIL = (process.env.AUTH_TEST_EMAIL || `auth_e2e_${Date.now()}@example.com`).trim().toLowerCase();
const TEST_PASSWORD = process.env.AUTH_TEST_PASSWORD || 'Password123!';

const collectCookies = (headers: Headers) => {
  const raw = (headers as any).getSetCookie?.() ?? [];
  const cookieLines = raw.length ? raw : headers.get('set-cookie')?.split(/,(?=\s*[^;]+?=)/) ?? [];

  return cookieLines
    .map((cookie: string) => cookie.split(';')[0])
    .filter(Boolean)
    .join('; ');
};

const requestJson = async (
  path: string,
  options: { method?: string; body?: any; cookies?: string; accessToken?: string } = {}
) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.cookies ? { Cookie: options.cookies } : {}),
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed with ${response.status}: ${JSON.stringify(data)}`);
  }

  return {
    data,
    cookies: collectCookies(response.headers),
    status: response.status,
  };
};

const startServer = () =>
  new Promise<http.Server>((resolve) => {
    const server = app.listen(PORT, () => resolve(server));
  });

const run = async () => {
  const server = await startServer();

  try {
    console.log('[AUTH TEST] Starting login E2E test', { email: TEST_EMAIL, apiUrl: API_URL });

    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
    await redis.del(`otp:${TEST_EMAIL}`);
    await redis.del(`pending_user:${TEST_EMAIL}`);

    const register = await requestJson('/auth/register', {
      method: 'POST',
      body: {
        fullName: 'Auth E2E User',
        email: TEST_EMAIL.toUpperCase(),
        password: TEST_PASSWORD,
      },
    });
    console.log('[AUTH TEST] Register passed', register.data);

    const otp = await redis.get(`otp:${TEST_EMAIL}`);
    const pendingUser = await redis.get(`pending_user:${TEST_EMAIL}`);
    if (!otp || !pendingUser) {
      throw new Error('OTP or pending user was not written to Redis');
    }
    console.log('[AUTH TEST] Redis OTP and pending user present');

    const verify = await requestJson('/auth/verify-otp', {
      method: 'POST',
      body: { email: TEST_EMAIL, otp },
    });
    if (!verify.data.accessToken || !verify.data.user?.id || verify.data.user.password) {
      throw new Error(`Verify OTP returned invalid auth contract: ${JSON.stringify(verify.data)}`);
    }
    verifyToken(verify.data.accessToken, env.JWT_SECRET);
    console.log('[AUTH TEST] Verify OTP passed and access JWT verified');

    const login = await requestJson('/auth/login', {
      method: 'POST',
      body: { email: TEST_EMAIL.toUpperCase(), password: TEST_PASSWORD },
    });
    if (!login.data.success || !login.data.accessToken || !login.data.user?.id || login.data.user.password) {
      throw new Error(`Login returned invalid auth contract: ${JSON.stringify(login.data)}`);
    }
    verifyToken(login.data.accessToken, env.JWT_SECRET);
    if (!login.cookies.includes('accessToken=') || !login.cookies.includes('refreshToken=')) {
      throw new Error('Login did not set accessToken and refreshToken cookies');
    }
    console.log('[AUTH TEST] Login passed, JWT verified, cookies set');

    const profile = await requestJson('/users/profile', {
      accessToken: login.data.accessToken,
      cookies: login.cookies,
    });
    if (!profile.data.data?.user?.id) {
      throw new Error(`Protected profile returned invalid response: ${JSON.stringify(profile.data)}`);
    }
    console.log('[AUTH TEST] Protected profile access passed');

    const refresh = await requestJson('/auth/refresh', {
      method: 'POST',
      cookies: login.cookies,
    });
    if (!refresh.data.accessToken || !refresh.data.user?.id) {
      throw new Error(`Refresh returned invalid auth contract: ${JSON.stringify(refresh.data)}`);
    }
    verifyToken(refresh.data.accessToken, env.JWT_SECRET);
    console.log('[AUTH TEST] Refresh passed and rotated access JWT verified');

    await requestJson('/auth/logout', {
      method: 'POST',
      accessToken: refresh.data.accessToken,
      cookies: refresh.cookies || login.cookies,
    });
    console.log('[AUTH TEST] Logout passed');

    const dbUser = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
    if (dbUser) {
      await prisma.user.delete({ where: { id: dbUser.id } });
    }

    console.log('[AUTH TEST] E2E auth login test passed');
  } finally {
    server.close();
    await prisma.$disconnect();
    redis.disconnect();
  }
};

run().catch((error) => {
  console.error('[AUTH TEST] E2E auth login test failed', error);
  process.exit(1);
});
