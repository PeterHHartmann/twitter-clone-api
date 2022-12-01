import prisma from '../config/prisma';
import { Request, Response, Router } from 'express';
import { verifyAccess } from '../middleware/verifyAccess';
// import path from 'path';
// import { extension } from 'mime-types';
// import { nanoid } from 'nanoid';
// import { readFile, mkdir, writeFile, rmdir } from 'fs/promises';
// import rimraf from 'rimraf';
// import PersistentFile from "formidable/PersistentFile";
import { banner, avatar, profile } from "@prisma/client";
import { ImageFile, parseForm } from "../utils/multipart";
import { uploadImage } from "../utils/imageUpload";
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
    if (req.username !== req.params.username) return res.status(401).json({});
    const profile = await prisma.profile.findUnique({
      where: { username: req.username },
    });
    if (!profile) return res.status(404).json({});
    const {fields, files} = await parseForm(req);    
    await prisma.profile.update({
      where: {
        username: req.username,
      },
      data: {
        displayname: fields.displayname as string || profile.displayname,
        bio: fields.bio as string || profile.bio,
        location: fields.location as string || profile.location,
      },
    });

    const banner = files.banner as unknown as ImageFile;
    if (banner) {
      await uploadImage(banner, profile.id, 'banner')
    }
    const avatar = files.avatar as unknown as ImageFile;
    if (avatar) {
      await uploadImage(avatar, profile.id, 'avatar')
    }
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({});
  }
});

export default router;
