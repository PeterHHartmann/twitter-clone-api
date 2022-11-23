import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { getAccessSecret } from '../utils/constants';

export const verifyAccess = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    await jwtVerify(token, new TextEncoder().encode(getAccessSecret()));
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
