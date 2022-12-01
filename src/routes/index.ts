import express from 'express';
import AuthRouter from './auth';
import ProfileRouter from './profile';
import ImageRouter from './image';
import TweetRouter from './tweet';

const router = express.Router();
router.use('/auth', AuthRouter);
router.use('/profile', ProfileRouter);
router.use('/image', ImageRouter);
router.use('/tweet', TweetRouter);

export default router;
