import prisma from '../config/prisma';
import { Request, Response, Router } from 'express';
import { verifyAccess } from '../middleware/verifyAccess';
import { banner, avatar, profile, tweet } from "@prisma/client";
import { ImageFile, parseForm } from "../utils/multipart";
import { uploadImage } from "../utils/imageUpload";
const router = Router();

router.post('/', verifyAccess, async (req: Request, res: Response) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { username: req.username },
        });
        if (!profile) return res.status(401).json({});
        const {fields, files} = await parseForm(req);  
        const tweet: tweet = await prisma.tweet.create({
            data: {
                text: fields.text as string,
                author: profile.id
            }
        })
        return res.sendStatus(200)
    } catch(err) {
        console.log(err);
    }
});

router.get('/:username', async (req: Request, res: Response) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { username: req.params.username },
        });
        if (!profile) return res.status(200).json({});
        const userTweets = await prisma.tweet.findMany({
            where: {
                author: profile.id
            }
        })
        console.log(userTweets);
        return res.status(200).json({...userTweets})
    } catch(err) {
        console.log(err);
    }
})

export default router;