import express from 'express';
import AuthRouter from './auth';
import AccountRouter from './account';

const router = express.Router();
router.use('/auth', AuthRouter);
router.use('/', AccountRouter);

export default router;
