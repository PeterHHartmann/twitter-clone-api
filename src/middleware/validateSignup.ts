import { NextFunction, Request, Response } from "express";
import prisma from '../prisma';

const emailRegex = new RegExp(process.env.REGEX_EMAIL as string);
const usernameRegex = new RegExp(process.env.REGEX_USERNAME as string);

export const validateSignup = async (req: Request, res: Response, next: NextFunction) => {
  console.log('hi');
  
  try {
    const body = req.body;
    if (!body || !body.email || !body.username || !body.password) return res.sendStatus(422);
    const email: string = body.email.toLowerCase();
    const username: string = body.username.toLowerCase();
    const password: string = body.password;
    // Cheapest checks first length checking
    if (username.length > 50){
      return res.status(422).json({ error: { target: 'username', msg: 'Username is too long' } });
    }
    if (password.length < 6){
      return res.status(422).json({ error: { target: 'password', msg: 'Password must be at least 6 characters long' } });
    }
    if (email.length > 320) {
      return res.status(422).json({ error: { target: 'email', msg: 'Please enter a valid email' }});
    }
    // Cheapish checks
    if (usernameRegex.test(username) === false) {
      return res.status(422).json({ error: { target: 'email', msg: 'Please enter a valid username' } });
    }
    if (emailRegex.test(email) === false) {
      return res.status(422).json({ error: {target: 'email', msg: 'Please enter a valid email'}});
    }
    // More expensive db checks/operations
    if (
      await prisma.account.findUnique({
        where: { email: email },
      })
    ) {
      return res.status(409).json({ error: { target: 'email', msg: 'This email is already in use' }});
    }
    if (usernameRegex.test(username) === false) {
      return res.status(422).json({ error: { target: 'email', msg: 'Please enter a valid username' }});
    }
    if (await prisma.account.findUnique({
      where: { email: username },
    })) {
      console.log('we got here');
      
      return res.status(409).json({ error: { target: 'username', msg: 'This username is already in use' }});
    }
    //if all checks are passed
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({error: {target: 'all', msg: 'Something went wrong. Please try again later'}})
  }
}