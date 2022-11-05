import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
const prisma = new PrismaClient();
const router = Router();

router.get(`/account/:email`, async (req, res) => {
  const result = await prisma.account.findUnique({
    where: { email: req.params.email },
  });
  res.json(result);
});

router.post(`/account`, async (req, res) => {
  console.log(req.body);
  const result = await prisma.account.create({
    data: { ...req.body },
  });
  res.json(result);
});

export default router;
