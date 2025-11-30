import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { config } from '../config/env';

const prisma = new PrismaClient();

export interface AuthPayload {
  token: string;
  user: User;
}

export async function register(email: string, password: string): Promise<AuthPayload> {
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed } });
  const token = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });
  return { token, user };
}

export async function login(email: string, password: string): Promise<AuthPayload> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });
  return { token, user };
}

export function verifyToken(token: string): { sub: string; email: string } {
  return jwt.verify(token, config.jwtSecret) as { sub: string; email: string };
}
