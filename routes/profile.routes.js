const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken.middleware');
const { getProfileView, getUserUploadsJSON, getUserFavouritesJSON } = require("../controllers/profile.controller");

const router = express.Router();

router.get('/user/profile/:username', getProfileView);

router.get('/api/users/:username/uploads', getUserUploadsJSON);

router.get('/api/users/:username/favourites', getUserFavouritesJSON);

module.exports = router