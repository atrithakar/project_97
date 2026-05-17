const express = require('express')
const router = express.Router()

const authRoutes = require('./auth.routes')
const uploadRoutes = require('./upload.routes')
const photoRoutes = require('./photo.routes')

router.use('/', authRoutes)
router.use('/', uploadRoutes)
router.use('/', photoRoutes)

module.exports = router;