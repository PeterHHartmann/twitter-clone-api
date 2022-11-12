import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const authenticateToken = (
  req: any, 
  res: any, 
  next: NextFunction
) => {
  // console.log(req);
  
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403)
    next() 
  })

}