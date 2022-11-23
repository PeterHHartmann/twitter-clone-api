import prisma from '../config/prisma';
import { Request, Response, Router } from 'express';
import { verifyAccess } from '../middleware/verifyAccess';
import busboy from 'busboy';
import path from "path";
import os from 'os';
import { randomFillSync } from "crypto";
import { createWriteStream } from "fs";
const router = Router();

const random = (() => {
  const buf = Buffer.alloc(16);
  return () => randomFillSync(buf).toString('hex');
})();

router.get('/:username', async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { username: req.params.username },
    });
    if (!profile) return res.status(404).json({});
    return res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({});
  }
});

router.post('/:username', verifyAccess, (req: Request, res: Response) => {
  try {
    if (req.user !== req.params.username) return res.status(401).json({});
    const bb = busboy({headers: req.headers});
    bb.on('file', (name, file, info) => {
      console.log(info);
      console.log('file happened yay');
      const saveTo = path.join(process.cwd(), 'public/', info.filename);
      file.pipe(createWriteStream(saveTo));
    });
    bb.on('field', (name, value, info) => {
      console.log(name, value, info);
    })
    // bb.on('close', () => {
    //   res.writeHead(200, {'Connection': 'close'})
    //   res.end(`That's all folks!`)
    // });
    req.pipe(bb);

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({});
  }
});

export default router;
