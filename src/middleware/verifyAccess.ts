import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { getAccessSecret } from '../utils/constants';

// export type RequestWithUser = Request & {
//   user: string
// }

export const verifyAccess = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  
  if (!token) return res.sendStatus(401);
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(getAccessSecret()));
    console.log(verified);
    
    req.username = verified.payload.username as string;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
