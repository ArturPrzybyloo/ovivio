// __ENV is provided by k6 at runtime; declare it for TypeScript.
declare const __ENV: Record<string, string | undefined>;

export type DummyJsonConfig = {
  baseUrl: string;
  username: string;
  password: string;
};

const DEFAULT_BASE_URL = 'https://dummyjson.com';

function requireEnv(varName: string): string {
  const value = __ENV[varName];
  if (!value) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
  return value;
}

export function getDummyJsonConfig(): DummyJsonConfig {
  return {
    baseUrl: __ENV.DUMMYJSON_BASE_URL || DEFAULT_BASE_URL,
    username: requireEnv('DUMMYJSON_USERNAME'),
    password: requireEnv('DUMMYJSON_PASSWORD')
  };
}

