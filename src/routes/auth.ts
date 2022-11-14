import { account, Prisma, PrismaClient, profile } from '@prisma/client';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const saltRounds = 10;
const prisma = new PrismaClient();
const router = Router();

router.post(`/signin`, async (req, res) => {
  if (req.body) {
      const account: account | null = await prisma.account.findUnique({
        where: { email: req.body.email },
      });
      if (account) {
          const passwordMatches = await bcrypt.compare(req.body.password, account.password);
          if(passwordMatches){
            const profile: profile | null = await prisma.profile.findUnique({
              where: { username: account.username },
            });
            const user: object = {
              username: account.username,
              displayname: profile?.displayname,
            };
            const token = jwt.sign(user, process.env.TOKEN_SECRET as string, { expiresIn: '1600s' });
            return res.json({ ...user, access_token: token });
          }
      }
  }
  console.log('we got here');
  return res.status(401).json({ error: 'error' });
});

router.post('/signup', async (req, res) => {
  const body = req.body;
  console.log(body);
  
  if (body) {
    //do validation here (code 422 Unprocessable Entity)
    const email: string = body.email;
    const username: string = body.username;
    const password: string = body.password;
    const hash = await bcrypt.hash(password, saltRounds);
    try {
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
          displayname: account.username
        }
      })
      return res.sendStatus(201)
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          const target = e.meta?.target as Array<string>
          if(target && target[0]) {
            return res.status(409).json({ field: target[0] });
          }
        }
      }
    }
  }
  return res.sendStatus(403);
});

export default router;
