import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<800', 'p(99)<1500']
  }
};

const BASE_URL = 'https://dummyjson.com';

const DEFAULT_USERNAME = 'kminchelle';
const DEFAULT_PASSWORD = '0lelplR';

export function setup() {
  const username = __ENV.DUMMYJSON_USERNAME || DEFAULT_USERNAME;
  const password = __ENV.DUMMYJSON_PASSWORD || DEFAULT_PASSWORD;

  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      username,
      password
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

  const accessToken = loginRes.json('accessToken');

  return { accessToken };
}

export default function (data) {
  const headers = {
    Authorization: `Bearer ${data.accessToken}`
  };

  const res = http.get(`${BASE_URL}/auth/me`, { headers });

  check(res, {
    'auth/me status is 200': (r) => r.status === 200
  });

  sleep(1);
}

