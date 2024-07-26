const express = require('express');
const jwt = require('jsonwebtoken')
const { verifyCitizen, isUserExisting } = require('../Config/external-api');
const User = require('../Model/AuthSchema');
const { hasUserVoted } = require('../Config/functions');
const expressAsyncHandler = require('express-async-handler')

const Router = express.Router();

const JWT_SECRET = 'a5618230a39e5803c71a6c0bb8a225350426ccd34cd7bf4f1ec677577798bcc1506e0ec470c7dc797344d210d4a0a826c5f4f383276bf579f8df2efce38a4838'


//Router.get('/login', (req, res) => {
//    res.render('login');
//});

const AuthUser = expressAsyncHandler(async (req, res) => {
    const { email, citizenNumber } = req.body;

    try {
        // Check if the user has already voted
        const hasVoted = await hasUserVoted(citizenNumber);
        if (hasVoted) {
            return res.status(403).json({ message: 'User has already voted' });
        }


        // Check if the user already exists
        const userExists = await isUserExisting(citizenNumber);
        if (userExists) {
            return res.status(403).json({ message: 'This citizen has already logged in' });
        }

        // Verify citizen details
        if (email && citizenNumber) {
            const { status, data: citizenData, message } = await verifyCitizen(citizenNumber, email);

            if (status) {
                const token = jwt.sign({ userId: citizenNumber }, JWT_SECRET, { expiresIn: '1h' });

                console.log(token)

                const newUser = new User({
                    citizenNumber: citizenNumber,
                    email: email,
                    firstName: citizenData.firstName,
                    lastName: citizenData.lastName,
                    state: citizenData.stateOfOrigin,
                    localGovernment: citizenData.localGov,
                    DOB: citizenData.dateOfBirth,
                    hasVoted: hasVoted,
                    token: token,
                    // _id: newUser._id
                })
                await newUser.save()

                return res.status(200).json({
                    message: 'Login successful',
                    token: token,
                    user: {
                        citizenNumber: newUser.citizenNumber,
                        email: newUser.email,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        state: newUser.state,
                        localGovernment: newUser.localGovernment,
                        DOB: newUser.DOB,
                    }
                });
            } else {
                console.log('invalid citizen details');
                return res.status(401).json({ message });
            }
        } else {
            console.log('Invalid input');
            return res.status(400).json({ message: 'Invalid input' });
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = AuthUser;

/*const AuthUser = Router.post('/login', async (req, res) => {
    const { email, citizenNumber } = req.body;

    try {
        // Check if the user has already voted
        const hasVoted = await hasUserVoted(citizenNumber);
        if (hasVoted) {
            return res.status(403).json({ error: 'User has already voted' });
        }

        // Check if the user is already logged in
        //if (req.session.userId) {
        //    return res.status(403).json({ error: 'User is already logged in' });
        // }

        // Verify citizen details
        if (email && citizenNumber) {
            const isCitizenVerified = await verifyCitizen(citizenNumber, email);

            if (isCitizenVerified) {
                // Generate a JWT
                console.log(isCitizenVerified.firstName)
                const token = jwt.sign({ userId: citizenNumber }, JWT_SECRET, { expiresIn: '1h' });
                console.log('logged in successful');
                return res.status(200).json({ token });
            } else {
                console.log('invalid citizen details');
                return res.status(401).json({ error: 'Invalid citizen details' });
            }
        } else {
            console.log('Invalid input');
            return res.status(400).json({ error: 'Invalid input' });
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});*/