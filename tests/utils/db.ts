import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createTestUser(input: { username: string; email: string; password: string }) {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  
  return prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      password: hashedPassword,
    },
  });
}

export async function deleteTestUser(email: string) {
  await prisma.user.deleteMany({ where: { email } });
}
