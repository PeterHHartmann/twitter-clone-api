import { Request, Response, Router } from 'express';
import prisma from "../config/prisma";
const router = Router();

router.get('/:pid/avatar/:image', async (req: Request, res: Response) => {
  console.log(req.params.pid);
  console.log(req.params.image);
  
  return res.sendStatus(200);
});

export default router;