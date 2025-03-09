const {Router}=require('express')
const {loginUser,registerUser}=require('../controllers/userController')

const router=Router()

// api/users
router.post('/register',registerUser)
router.post('/login',loginUser)

module.exports=router