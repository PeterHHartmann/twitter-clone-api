import { ImageFile } from "./multipart";
import path from 'path';
import { readFile, mkdir, writeFile, rmdir } from 'fs/promises';
import { extension } from 'mime-types';
import rimraf from 'rimraf';
import { nanoid } from 'nanoid';
import prisma from '../config/prisma';

const allowedMimeTypes = ['image/jpeg', 'image/png']

export const uploadImage = async (image: ImageFile, profileId: number, type: string) => {
  if(allowedMimeTypes.indexOf(image.mimetype) < 0) throw new Error('MimeType not allowed')
  const buffer = await readFile(image.filepath as string);
  const ext = extension(image.mimetype) || '';
  const dirName = path.join(process.cwd(), 'public/', `${profileId}/${type}`);
  console.log(dirName);
  
  rimraf(dirName + '/*', (err) => {
    if (err) {
      throw new Error('rimraf failed');
    }
  });
  await mkdir(dirName, { recursive: true });
  const newpath = `/public/${profileId}/${type}/${nanoid() + '.' + ext}`;

  const saveTo = path.join(process.cwd(), newpath);
  await writeFile(saveTo, buffer);

  if (type === 'avatar') {
    try {
      await prisma.avatar.upsert({
        where: {
          profile_id: profileId,
        },
        update: {
          path: newpath,
        },
        create: {
          profile_id: profileId,
          path: newpath,
        },
      });
    } catch (err) {
      console.log(err);
    } 
  } else if (type === 'banner') {
    try {
      await prisma.banner.upsert({
        where: {
          profile_id: profileId,
        },
        update: {
          path: newpath,
        },
        create: {
          profile_id: profileId,
          path: newpath,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  return
}