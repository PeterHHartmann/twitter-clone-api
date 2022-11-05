import express from 'express'
import AccountRouter from './account'

const router = express.Router()
router.use('/', AccountRouter)

export default router
