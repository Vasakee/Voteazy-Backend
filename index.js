const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const User = require('./Model/AuthSchema')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const { DeleteCandidate, PostCandidate, GetCandidatesCategory, GetCandidates, GetCandidate } = require('./Controllers/CandidateController')
const { AuthVoter, AllowToVote, VerifyVote } = require('./Controllers/VoteController')
const AuthUser = require('./Controllers/AuthController')
//const VoteRoutes = require('./Controllers/VoteController')
//const crypto = require('crypto')
const { RegisterAdmin, AuthorizeAdmin, GetAdmins, GetAdmin, TestPassword, DeleteAdmin } = require('./Controllers/AdminController')
const { PostParty, GetParties, GetParty, DeleteParty } = require('./Controllers/PartyController')
const UserRoutes = require('./Routes/UserRoutes')
const AdminRoutes = require('./Routes/AdminRoutes')
const PartyRoute = require('./Routes/PartyRoutes')
const CandidateRoutes = require('./Routes/CandidateRoutes')
const VoteRoutes = require('./Routes/VoteRoutes')


dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({ extended: true }));
/*app.use(session({
    secret: 'ff54c438cd6197054d473fb9008359a204b72f068910caab17d3789603df3c0f',
    resave: false,
    saveUninitialized: false
}));*/
//const secret = crypto.randomBytes(64).toString('hex');
//console.log(secret);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log(`connected to mongoDB`)
    }).catch((error) => {
        console.log(`error connecting to mongoDB`)
    })
//app.post('/candidates', (CandidateRoute))

app.get('/', (req, res) => {
    res.send('Api is running successfully')
})
app.use('/auth', UserRoutes)
app.use('/admin', AdminRoutes)
app.use('/party', PartyRoute)
app.use('/candidates', CandidateRoutes)
app.use('/vote', VoteRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    //const secretKey = Crypto.randomBytes(32).toString('hex')
    // console.log(secretKey)
})
