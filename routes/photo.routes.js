const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken.middleware');
const {getFeed, downloadPhotoFile} = require('../controllers/photo.controller');
const { toggleFavourite, checkFavouriteStatus } = require('../controllers/favourite.controller');


const router = express.Router();

router.get('/api/photos/feed', authenticateToken, getFeed)
router.get('/api/photos/download/:id', downloadPhotoFile)
// router.js

// GET checks the current status when the page loads
router.get('/api/photos/:id/favourite/status', authenticateToken, checkFavouriteStatus);

// POST toggles the state (adds if missing, removes if present)
router.post('/api/photos/:id/favourite', authenticateToken, toggleFavourite);



module.exports = router;