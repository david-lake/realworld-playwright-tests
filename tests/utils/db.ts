import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { User } from '../data/users';

const prisma = new PrismaClient();

export interface TestUserInput {
  username: string;
  email: string;
  password: string;
}

export async function createTestUser(input: TestUserInput): Promise<User> {
  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      password: hashedPassword,
    },
  });

  return {
    username: user.username,
    email: user.email,
    password: input.password, // Return plaintext for login
  };
}

export async function cleanupTestUser(email: string): Promise<void> {
  await prisma.user.deleteMany({
    where: { email },
  });
}
