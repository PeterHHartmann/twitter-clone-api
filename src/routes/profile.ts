import prisma from '../config/prisma';
import { Request, Response, Router } from 'express';
import { verifyAccess } from '../middleware/verifyAccess';
import { IncomingForm } from 'formidable';
import path from 'path';
import { extension } from 'mime-types';
import PersistentFile from 'formidable/PersistentFile';
import { nanoid } from 'nanoid';
import { readFile, mkdir, writeFile, rmdir } from 'fs/promises';
import rimraf from 'rimraf';
import { profile } from "@prisma/client";
const router = Router();

router.get('/:username', async (req, res) => {
  try {
    const profile: profile | null = await prisma.profile.findUnique({
      where: { username: req.params.username },
    });
    if (!profile) return res.status(404).json({});
    const banner = await prisma.banner.findUnique({
      where: { profile_id: profile.id }
    })

    return res.status(200).json({...profile, banner: banner?.path});
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

    type FormData = {
      displayname: string;
      bio: string;
      location: string;
      banner: PersistentFile;
    };

    const parseForm = new Promise<FormData>((resolve, reject) => {
      const form = new IncomingForm({ multiples: true });
      form.parse(req, async (err: any, fields: any, files: any) => {
        if (err) reject(err);
        const data = {
          displayname: fields.displayname,
          bio: fields.bio,
          location: fields.location,
          banner: files.banner,
        };
        resolve({ ...data });
      });
    });

    const formData = await parseForm;

    await prisma.profile.update({
      where: {
        username: req.username,
      },
      data: {
        displayname: formData.displayname || profile.displayname,
        bio: formData.bio || profile.bio,
        location: formData.location || profile.location,
      },
    });

    type ImageFile = PersistentFile & {
      filepath: string;
      originalFilename: string;
      mimetype: string;
    };

    const banner = formData.banner as ImageFile;
    if (banner) {
      const buffer = await readFile(banner.filepath);
      const ext = extension(banner.mimetype) || '';
      const dirName = path.join(process.cwd(), 'public/', `${profile.id}/banner`);
      rimraf(dirName + '/*', (err) => {
        if (err) {
          throw new Error('rimraf failed');
        }
      });
      await mkdir(dirName, { recursive: true });
      const newpath = `/public/${profile.id}/banner/${nanoid() + '.' + ext}`;

      const saveTo = path.join(process.cwd(), newpath);
      await writeFile(saveTo, buffer);
      try {
        await prisma.banner.upsert({
          where: {
            profile_id: profile.id,
          },
          update: {
            path: newpath,
          },
          create: {
            profile_id: profile.id,
            path: newpath,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({});
  }
});

export default router;
