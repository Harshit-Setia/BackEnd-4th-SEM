import {Router} from 'express'
import {loginUser,registerUser,checkStatus, logoutUser} from '../controllers/userController.js'
import { upload } from '../middleware/multer.js'
import { auth } from '../middleware/auth.js'

const router=Router()

// api/users
router.get('/',checkStatus)
router.post('/register',upload.single("avatar"),registerUser)
router.post('/login',loginUser)
router.post('/logout',auth,logoutUser)

export const userRoute=router