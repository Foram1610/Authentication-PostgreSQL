const express = require('express')
const route = express.Router()
const user = require('../controllers/user.controller')
const imageMiddleware = require('../middleware/image')
const authMiddleware = require('../middleware/auth')

route.post('/', authMiddleware, imageMiddleware.single('avatar'), user.addUser)

module.exports = route