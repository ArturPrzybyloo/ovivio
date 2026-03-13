import { sleep } from 'k6';
import { getDummyJsonConfig } from '../src/utils/config';
import { getScenarioOptions } from '../src/scenarios';
import { loginAndGetToken, getAuthMe } from '../src/actions/auth';

type SetupData = {
  accessToken: string;
};

export const options = getScenarioOptions();

export function setup(): SetupData {
  const config = getDummyJsonConfig();

  const accessToken = loginAndGetToken(config);

  return { accessToken };
}

export default function (data: SetupData): void {
  const config = getDummyJsonConfig();

  getAuthMe(config, data.accessToken);

  sleep(1);
}

