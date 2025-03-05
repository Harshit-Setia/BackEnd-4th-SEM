const express = require('express');
const { display, loginUser , registerUser  } = require('../controllers/userController');

const router = express.Router();

// api/users
router.get('/', display)
router.post('/register', registerUser );
router.post('/login', loginUser );

module.exports = router;