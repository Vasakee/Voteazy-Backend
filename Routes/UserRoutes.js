const express = require('express')
const AuthUser = require('../Controllers/AuthController')
const UserRoutes = express.Router()

UserRoutes.get('/login', AuthUser)

module.exports = UserRoutes