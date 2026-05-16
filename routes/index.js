const express = require('express')
const router = express.Router()

const authRoutes = require('./auth.routes')
const uploadRoutes = require('./upload.routes')

router.use('/', authRoutes)
router.use('/', uploadRoutes)

module.exports = router;