import express from 'express';
import AuthRouter from './auth';
import ProfileRouter from './profile';

const router = express.Router();
router.use('/auth', AuthRouter);
router.use('/profile', ProfileRouter);

export default router;
