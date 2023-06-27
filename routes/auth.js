const express = require('express')
const route = express.Router()
const auth = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth')

route.post('/login', auth.login)

module.exports = route