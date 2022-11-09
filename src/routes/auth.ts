import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient();
const router = Router();

router.post(`/login`, async (req, res) => {
  if (req.body) {
    try {
      const result = await prisma.account.findUnique({
        where: { email: req.body.email },
      });
      if (result !== null){
        console.log(result);
        if (result?.password && result.password === req.body.password) {
          console.log('we got here success');
          const token = jwt.sign(result, process.env.TOKEN_SECRET as string, { expiresIn: '1600s' });
          const obj = {access_token: token, user: result.username}
          console.log(token);
          return res.json(obj);
        }
      }
    } catch(e) {
      console.log(e);
      return res.sendStatus(401);
    }
  }
  console.log('we got here')
  return res.sendStatus(401);
});

export default router;
