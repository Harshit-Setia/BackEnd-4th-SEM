import {Router} from 'express'
import {loginUser,registerUser,userData, logoutUser,updateUser} from '../controllers/userController.js'
import { upload } from '../middleware/multer.js'
import { auth } from '../middleware/auth.js'

const router=Router()

// api/users
router.get('/profile',auth,userData)
router.get('/:id',userData)
router.post('/register',upload.single("avatar"),registerUser)
router.post('/login', auth, loginUser)
router.post('/logout',auth,logoutUser)
router.put('/update',auth,upload.single("avatar"),updateUser)

export const userRoute=router