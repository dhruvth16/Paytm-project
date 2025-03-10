import express from 'express'
import { getUser, updateUser, userSignin, userSignup } from '../controllers/user.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const router = express.Router()


router.get("/", (req, res) => {
    res.send("From router")
})

router.post('/signup', userSignup)
router.post('/signin', userSignin)
router.put('/update', authMiddleware, updateUser)
router.get('/bulk', authMiddleware, getUser)