const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken.middleware');
const snapmaticUpload = require('../middlewares/multer.middleware');
const processUpload = require('../controllers/upload.controller');
const validateSnapmaticContents = require('../middlewares/validateImg.middleware');


const router = express.Router();

router.post('/upload', authenticateToken, snapmaticUpload, validateSnapmaticContents, processUpload)

module.exports = router;