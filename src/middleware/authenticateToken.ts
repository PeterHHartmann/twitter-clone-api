import { NextFunction, Request, Response } from 'express';

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.sendStatus(401);
//   jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
//     if (err) return res.sendStatus(403);
//     next();
//   });
// };
