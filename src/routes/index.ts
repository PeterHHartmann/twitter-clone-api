import express from 'express';
import AuthRouter from './auth';
import ProfileRouter from './profile';
import ImageRouter from './image'

const router = express.Router();
router.use('/auth', AuthRouter);
router.use('/profile', ProfileRouter);
router.use('/image', ImageRouter)

export default router;
