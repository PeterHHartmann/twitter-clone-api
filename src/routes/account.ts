import prisma from "../prisma";
import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
const router = Router();

router.get(`/account/:email`, async (req, res) => {
  const result = await prisma.account.findUnique({
    where: { email: req.params.email },
    include: {
      profile: true
    }
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
