const express = require('express');
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');
const { insertUserInDB, fetchPasswordHash } = require('../models/user.model');
const authenticateToken = require('../middlewares/authenticateToken.middleware');
const jwt =require('jsonwebtoken');
const { handleLogout, sendHomePage, handleLogin, sendLoginPage, handleSignup, sendSignupPage } = require('../controllers/auth.controller');

const router = express.Router();

router.get('/', sendSignupPage)
router.post('/signup', handleSignup);

router.get('/login', sendLoginPage)
router.post('/login', handleLogin)

router.get('/home', authenticateToken, sendHomePage)

router.post('/logout', handleLogout, handleLogout)

module.exports = router;