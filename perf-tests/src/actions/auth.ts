import http, { RefinedResponse } from 'k6/http';
import { check } from 'k6';
import type { DummyJsonConfig } from '../utils/config';

export type AuthResponse = RefinedResponse<'text'>;

export function loginAndGetToken(config: DummyJsonConfig): string {
  const loginRes: AuthResponse = http.post(
    `${config.baseUrl}/auth/login`,
    JSON.stringify({
      username: config.username,
      password: config.password
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login has accessToken': (r) => !!r.json('accessToken')
  });

  return loginRes.json('accessToken') as string;
}

export function getAuthMe(config: DummyJsonConfig, accessToken: string): AuthResponse {
  const res: AuthResponse = http.get(`${config.baseUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  check(res, {
    'auth/me status is 200': (r) => r.status === 200
  });

  return res;
}

