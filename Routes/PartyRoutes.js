const express = require('express')
const { verifyAdmin } = require('../Config/functions')
const { RegisterParty, GetParties, GetParty, DeleteParty } = require('../Controllers/PartyController')
const PartyRoute = express.Router()

PartyRoute.post('/', verifyAdmin, RegisterParty)
PartyRoute.get('/', GetParties)
PartyRoute.get('/:id', GetParty)
PartyRoute.delete('/', verifyAdmin, DeleteParty)

module.exports = PartyRoute