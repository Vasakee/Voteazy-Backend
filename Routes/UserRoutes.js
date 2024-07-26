const express = require('express')
const AuthUser = require('../Controllers/AuthController')
const UserRoutes = express.Router()

UserRoutes.post('/login', AuthUser)

module.exports = UserRoutes
