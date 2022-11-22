import prisma from '../config/prisma';
import { Router } from 'express';
const router = Router();

router.get(`/:username`, async (req, res) => {
  const result = await prisma.profile.findUnique({
    where: { username: req.params.username },
  });
  if (!result) return res.status(404).json({});
  return res.status(200).json(result);
});

export default router;
