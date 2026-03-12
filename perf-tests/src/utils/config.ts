// __ENV is provided by k6 at runtime; declare it for TypeScript.
declare const __ENV: Record<string, string>;

export type DummyJsonConfig = {
  baseUrl: string;
  username: string;
  password: string;
};

const DEFAULT_CONFIG: DummyJsonConfig = {
  baseUrl: 'https://dummyjson.com',
  username: 'kminchelle',
  password: '0lelplR'
};

export function getDummyJsonConfig(): DummyJsonConfig {
  return {
    baseUrl: __ENV.DUMMYJSON_BASE_URL || DEFAULT_CONFIG.baseUrl,
    username: __ENV.DUMMYJSON_USERNAME || DEFAULT_CONFIG.username,
    password: __ENV.DUMMYJSON_PASSWORD || DEFAULT_CONFIG.password
  };
}

