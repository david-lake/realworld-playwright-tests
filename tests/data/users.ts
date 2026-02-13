export interface User {
  username: string;
  email: string;
  password: string;
}

export const users = {
  standard: {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  }
} as const;

export function generateUser(): User {
  const timestamp = Date.now();
  return {
    username: `user${timestamp}`,
    email: `user${timestamp}@test.com`,
    password: 'TestPass123!'
  };
}
