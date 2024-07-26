const express = require('express')
const { RegisterAdmin, AuthorizeAdmin, GetAdmins, GetAdmin, DeleteAdmin } = require('../Controllers/AdminController')
const AdminRoutes = express.Router()

AdminRoutes.post('/Register', RegisterAdmin)
AdminRoutes.post('/login', AuthorizeAdmin)
AdminRoutes.get('/', GetAdmins)
AdminRoutes.get('/:id', GetAdmin)
AdminRoutes.delete(':id', DeleteAdmin)

module.exports = AdminRoutes