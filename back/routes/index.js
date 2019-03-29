const express = require('express')
const router = express.Router();
const userRoutes = require('./userRoutes')
const roomRoutes = require('./roomRoutes')

router.use('/user', userRoutes)
router.use('/room', roomRoutes)

module.exports = router