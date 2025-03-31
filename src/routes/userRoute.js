import {Router} from 'express'
import {loginUser,registerUser} from '../controllers/userController.js'

const router=Router()

// api/users
router.post('/register',registerUser)
router.post('/login',loginUser)

export const userRoute=router