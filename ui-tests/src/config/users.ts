type UserCredentials = {
  username: string;
  password: string;
};

type UsersConfig = {
  standard: UserCredentials;
  lockedOut: UserCredentials;
};

const defaultUsers: UsersConfig = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  }
};

export const users: UsersConfig = {
  standard: {
    username: process.env.STANDARD_USER ?? defaultUsers.standard.username,
    password: process.env.STANDARD_PASSWORD ?? defaultUsers.standard.password
  },
  lockedOut: {
    username: process.env.LOCKED_OUT_USER ?? defaultUsers.lockedOut.username,
    password: process.env.LOCKED_OUT_PASSWORD ?? defaultUsers.lockedOut.password
  }
};

