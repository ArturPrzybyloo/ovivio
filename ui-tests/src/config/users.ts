type UserCredentials = {
  username: string;
  password: string;
};

type UsersConfig = {
  standard: UserCredentials;
  lockedOut: UserCredentials;
};

function requireEnv(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
  return value;
}

export const users: UsersConfig = {
  standard: {
    username: requireEnv('STANDARD_USER'),
    password: requireEnv('STANDARD_PASSWORD')
  },
  lockedOut: {
    username: requireEnv('LOCKED_OUT_USER'),
    password: requireEnv('LOCKED_OUT_PASSWORD')
  }
};

