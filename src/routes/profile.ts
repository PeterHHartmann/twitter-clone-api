import prisma from '../config/prisma';
import { Router } from 'express';
import { verifyAccess } from '../middleware/verifyAccess';
const router = Router();

router.get(`/:username`, verifyAccess, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { username: req.params.username },
    });
    if (!profile) return res.status(404).json({});
    return res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({})
  }
});

export default router;
