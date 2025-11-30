import { Router } from 'express';
import { login, register } from '../auth/authService';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await register(email, password);
    await prisma.dataSourceConnection.createMany({
      data: [
        { type: 'state_iis', status: 'not_connected', userId: result.user.id },
        { type: 'smart_on_fhir', status: 'not_connected', userId: result.user.id },
        { type: 'pharmacy', status: 'not_connected', userId: result.user.id }
      ]
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/demo', async (_req, res) => {
  const email = 'demo@whitecloud.test';
  const password = 'demo1234';
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const { user: created } = await register(email, password);
    user = created;
  }
  const result = await login(email, password);
  res.json(result);
});

export default router;
