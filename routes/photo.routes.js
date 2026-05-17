const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken.middleware');
const getFeed = require('../controllers/photo.controller');


const router = express.Router();

router.get('/api/photos/feed', authenticateToken, getFeed)

module.exports = router;