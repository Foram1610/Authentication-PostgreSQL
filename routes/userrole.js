const express = require('express')
const route = express.Router()
const userrole = require('../controllers/userrole.controller')

route.post('/',userrole.addUserRole)

module.exports = route