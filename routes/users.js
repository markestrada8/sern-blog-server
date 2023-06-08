import { addUser } from '../controllers/user.js'
import express from 'express'

const router = express.Router()

router.post('/', addUser)

export default router