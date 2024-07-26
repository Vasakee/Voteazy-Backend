const express = require('express')
const { verifyAdmin } = require('../Config/functions')
const { RegisterCandidate, GetCandidatesCategory, GetCandidates, GetCandidate, DeleteCandidate } = require('../Controllers/CandidateController')
const CandidateRoutes = express.Router()

CandidateRoutes.post('/:categoryName', verifyAdmin, RegisterCandidate)
CandidateRoutes.get('/:categoryName', GetCandidatesCategory)
CandidateRoutes.get('/', GetCandidates)
CandidateRoutes.get('/candidate/:candidateId', GetCandidate)
CandidateRoutes.delete('/:categoryName/:candidateId', verifyAdmin, DeleteCandidate)

module.exports = CandidateRoutes