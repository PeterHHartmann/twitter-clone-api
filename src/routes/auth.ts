import prisma from '../prisma'
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validateSignup } from "../middleware/validateSignup";
import { account, profile } from "@prisma/client";
import { authenticateToken } from '../middleware/authenticateToken';
const saltRounds = 10;
const router = Router();

router.post(`/signin`, async (req: Request, res: Response) => {
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
          const user: object = {
            username: account.username,
            displayname: profile?.displayname,
          };
          const tokenExpires = 60 * 60 * 24 * 30;
          const token = jwt.sign(user, process.env.TOKEN_SECRET as string, { expiresIn: tokenExpires });
          return res.json({ ...user, accessToken: token, accessTokenExpires: tokenExpires });
        }
      }
    }
    return res.status(401).json({ error: 'Wrong email or password' });
  } catch (e) {
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
    return res.sendStatus(201);
  } catch (e) {
    return res.status(500).json({ error: { target: 'all', msg: 'Something went wrong. Please try again later' } });
  }
});

router.get('/session', authenticateToken, async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      return res.status(200).json(user)
    });
  } catch(e) {
    return res.sendStatus(500)
  }
});

export default router;
