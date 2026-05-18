const express = require('express')
const router = express.Router()

const authRoutes = require('./auth.routes')
const uploadRoutes = require('./upload.routes')
const photoRoutes = require('./photo.routes')
const viewRoutes = require('./view.routes')

router.use('/', authRoutes)
router.use('/', uploadRoutes)
router.use('/', photoRoutes)
router.use('/view', viewRoutes)

module.exports = router;