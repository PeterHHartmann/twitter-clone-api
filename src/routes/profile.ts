import prisma from '../config/prisma';
import { Request, Response, Router } from 'express';
import { verifyAccess } from '../middleware/verifyAccess';
import { banner, avatar, profile } from "@prisma/client";
const router = Router();

router.get('/:username', async (req, res) => {
  try {
    const profile: profile | null = await prisma.profile.findUnique({
      where: { username: req.params.username },
    });
    if (!profile) return res.status(404).json({});
    const banner: banner | null = await prisma.banner.findUnique({
      where: { profile_id: profile.id }
    })
    const avatar: avatar | null = await prisma.avatar.findUnique({
      where: { profile_id: profile.id },
    });
    return res.status(200).json({...profile, banner: banner?.path, avatar: avatar?.path});
  } catch (err) {
    console.log(err);
    return res.status(500).json({});
  }
});

router.put('/:username', verifyAccess, async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    
    if (req.username !== req.params.username) return res.status(401).json({});
    const profile = await prisma.profile.findUnique({
      where: { username: req.username },
    });
    if (!profile) return res.status(404).json({});
    await prisma.profile.update({
      where: {
        username: req.username,
      },
      data: {
        displayname: req.body.displayname as string || profile.displayname,
        bio: req.body.bio as string || profile.bio,
        location: req.body.location as string || profile.location,
      },
    });
    if (req.body.banner) {
      await prisma.banner.upsert({
        where: {
          profile_id: profile.id,
        },
        update: {
          path: req.body.banner,
        },
        create: {
          profile_id: profile.id,
          path: req.body.banner,
        },
      });
    }
    if (req.body.avatar) {
      await prisma.avatar.upsert({
        where: {
          profile_id: profile.id,
        },
        update: {
          path: req.body.avatar,
        },
        create: {
          profile_id: profile.id,
          path: req.body.avatar,
        },
      });
    }
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({});
  }
});

export default router;
