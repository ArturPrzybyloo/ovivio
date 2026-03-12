import http, { RefinedResponse } from 'k6/http';
import { check, sleep } from 'k6';
import { getDummyJsonConfig } from '../src/utils/config';
import { getScenarioOptions } from '../src/scenarios';

type SetupData = {
  accessToken: string;
};

export const options = getScenarioOptions();

export function setup(): SetupData {
  const config = getDummyJsonConfig();

  const loginRes: RefinedResponse<'text'> = http.post(
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

  const accessToken = loginRes.json('accessToken') as string;

  return { accessToken };
}

export default function (data: SetupData): void {
  const config = getDummyJsonConfig();

  const headers = {
    Authorization: `Bearer ${data.accessToken}`
  };

  const res: RefinedResponse<'text'> = http.get(`${config.baseUrl}/auth/me`, { headers });

  check(res, {
    'auth/me status is 200': (r) => r.status === 200
  });

  sleep(1);
}

