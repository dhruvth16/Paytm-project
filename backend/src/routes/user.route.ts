import express from 'express'
import { userSignin, userSignup } from '../controllers/user.controller'

export const router = express.Router()

router.get("/", (req, res) => {
    res.send("From router")
})

router.post('/signup', userSignup)
router.post('/signin', userSignin)