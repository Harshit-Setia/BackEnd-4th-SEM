import {Router} from 'express'
import {loginUser,registerUser,checkStatus} from '../controllers/userController.js'
import { upload } from '../middleware/multer.js'

const router=Router()

// api/users
router.get('/',checkStatus)
router.post('/register',upload.single("avatar"),registerUser)
router.post('/login',loginUser)

export const userRoute=router