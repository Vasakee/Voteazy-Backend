const express = require('express')
const { authMiddleware } = require('../Config/functions')
const { AuthVoter, AllowToVote, VerifyVote } = require('../Controllers/VoteController')
const VoteRoutes = express.Router()

VoteRoutes.post('/login', AuthVoter)
VoteRoutes.get('/voters', authMiddleware, AllowToVote)
VoteRoutes.get('/votes', authMiddleware, VerifyVote)

module.exports = VoteRoutes