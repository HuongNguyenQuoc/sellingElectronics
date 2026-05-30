const express = require('express')
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser); // POST: /api/users/register
router.post('/login', loginUser); // POST: /api/users/login

module.exports = router;