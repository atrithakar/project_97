const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken.middleware');
const { handleLogout, sendHomePage, handleLogin, sendLoginPage, handleSignup, sendSignupPage } = require('../controllers/auth.controller');

const router = express.Router();

router.get('/', sendSignupPage)
router.post('/signup', handleSignup);

router.get('/login', sendLoginPage)
router.post('/login', handleLogin)

router.get('/home', authenticateToken, sendHomePage)

router.post('/logout', handleLogout)

module.exports = router;