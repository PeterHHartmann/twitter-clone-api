import { account, Prisma, PrismaClient, profile } from '@prisma/client';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const saltRounds = 10;
const prisma = new PrismaClient();
const router = Router();

router.post(`/login`, async (req, res) => {
  if (req.body) {
    try {
      const account: account | null = await prisma.account.findUnique({
        where: { email: req.body.email },
      });
      if (account) {
        try {
          const passwordMatches = await bcrypt.compare(req.body.password, account.password);
          if(passwordMatches){
            const profile: profile | null = await prisma.profile.findUnique({
              where: { username: account.username },
            });
            const user = {
              username: account.username,
              displayname: profile?.displayname,
            };
            const token = jwt.sign(user, process.env.TOKEN_SECRET as string, { expiresIn: '1600s' });
            return res.json({ ...user, access_token: token });
          }
        } catch(e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  console.log('we got here');
  return res.sendStatus(401);
});

router.post('/signup', async (req, res) => {
  const body = req.body;
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
      res.sendStatus(201)
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          res.statusCode = 403;
          const target = e.meta?.target as Array<string>
          if(target && target[0] === 'email') {
            return res.json({ msg: 'Email is already taken' }).sendStatus(409);
          } else if (target && target[0] === 'username') {
            return res.json({ msg: 'Username is already taken' }).sendStatus(409);
          }
        }
      }
    }
  }
  return res.sendStatus(403);
});

export default router;
