import prisma from '../config/prisma';
import { Request, Response, Router } from 'express';
import { SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { validateSignup } from '../middleware/validateSignup';
import { account, profile } from '@prisma/client';
import { getAccessSecret } from '../utils/constants';
const saltRounds = 10;
const router = Router();

router.post('/signin', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log(body);

    if (!body || !body.email || !body.password) return res.status(422).json({ error: 'Wrong email or password' });
    const email = body.email;
    const password = body.password;

    if (email && password) {
      const account: account | null = await prisma.account.findUnique({
        where: { email: email },
      });
      if (account && account.email && account.password) {
        const passwordMatches = await bcrypt.compare(password, account.password);
        if (passwordMatches) {
          const profile: profile | null = await prisma.profile.findUnique({
            where: { username: account.username },
          });
          const expires = 60 * 60 * 24 * 7;
          const user = {
            username: account.username,
            displayname: profile?.displayname,
          };
          const accessToken = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setJti(nanoid())
            .setExpirationTime(Date.now() + expires)
            .setIssuedAt()
            .sign(new TextEncoder().encode(getAccessSecret()));
          return res.status(200).json({ user: user, accessToken: accessToken, accessTokenExpires: expires });
        }
      }
    }
    return res.status(401).json({ error: 'Wrong email or password' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong please try again later' });
  }
});

router.post('/signup', validateSignup, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body || !body.email || !body.username || !body.password) return res.sendStatus(422);
    const email: string = req.body.email.toLowerCase();
    const username: string = req.body.username.toLowerCase();
    const password: string = req.body.password;

    const hash = await bcrypt.hash(password, saltRounds);
    const account = await prisma.account.create({
      data: {
        email: email,
        username: username,
        password: hash,
      },
    });
    await prisma.profile.create({
      data: {
        username: account.username,
        displayname: account.username,
      },
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: { target: 'all', msg: 'Something went wrong. Please try again later' } });
  }
});

export default router;
