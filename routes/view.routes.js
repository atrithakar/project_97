const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken.middleware');
const {getPhotoInfo} = require('../controllers/photo.controller');


const router = express.Router();

router.get('/photo/:id', getPhotoInfo)

module.exports = router;