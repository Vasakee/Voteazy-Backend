const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const { Vote, Candidate, Category } = require('../Model/VoteSchema');
const User = require('../Model/AuthSchema')
const { hasUserVoted, updateCandidateVotes } = require('../Config/functions')
const expressAsyncHandler = require('express-async-handler');
const { authMiddleware } = require('../Config/functions');

const Router = express.Router();
const JWT_SECRET = 'a5618230a39e5803c71a6c0bb8a225350426ccd34cd7bf4f1ec677577798bcc1506e0ec470c7dc797344d210d4a0a826c5f4f383276bf579f8df2efce38a4838'
//const app = express();

Router.use(express.urlencoded({ extended: true }))


Router.get('/login', (req, res) => {
    res.render('login');
});

const AuthVoter = expressAsyncHandler(async (req, res) => {
    const { email, citizenNumber } = req.body;
    const user = await User.findOne({ citizenNumber });
    const userId = req.userId;

    if (!user || !user.verifyPassword(citizenNumber)) {
        return res.status(401).json({ error: 'Invalid email or citizenNumber' });
    }

    const hasVoted = await hasUserVoted(userId);
    if (hasVoted) {
        return res.status(403).json({ error: 'User has already voted' });
    }

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });

    res.redirect('/vote/voters');
});

/*const AllowToVote = Router.get('/voters', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        //const user = await User.findById(userId)
        const hasVoted = await hasUserVoted(userId);

        if (hasVoted) {
            return res.status(403).json({ error: 'User has already voted' });
        }

        const categories = await Category.find().populate('candidates');
        res.status(200).json({ categories })
        /*res.render('vote', { categories });
    } catch (error) {
        console.error('An error occurred:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});*/

const AllowToVote = expressAsyncHandler(async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId)
        const user = await User.findOne({ citizenNumber: userId });


        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hasVoted = await hasUserVoted(userId);
        if (hasVoted) {
            return res.status(403).json({ error: 'User has already voted' });
        }

        // Get categories and filter candidates based on user's state and local government
        const categories = await Category.find().populate('candidates');
        const filteredCategories = categories.map(category => {
            if (category.name === 'President') {
                // Display all candidates in the President category
                return category;
            } else if (category.name === 'Governor') {
                // Filter candidates by state for the Governor category
                category.candidates = category.candidates.filter(candidate => candidate.state === user.state);
            } else if (category.name === 'Chairman') {
                // Filter candidates by local government for the Chairman category
                category.candidates = category.candidates.filter(candidate => candidate.localGovernment === user.localGovernment);
            }
            return category;
        });

        res.status(200).json({ categories: filteredCategories });
        // Uncomment the line below to render a view instead
        // res.render('vote', { categories: filteredCategories });
    } catch (error) {
        console.error('An error occurred:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

const VerifyVote = expressAsyncHandler(async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        /*if (!user) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }*/

        console.log('User ID:', userId)

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' })
        }

        const hasVoted = await hasUserVoted(userId);
        if (hasVoted) {
            return res.status(403).json({ error: 'User has already voted' });
        }

        const selectedOptions = req.body.selectedOptions;
        console.log(`User ${userId} voting for candidates: ${selectedOptions}`);

        for (const candidateId of selectedOptions) {
            const category = await Category.findOne({ 'candidates._id': candidateId }, { 'candidates.$': 1 });
            if (category) {
                const candidate = category.candidates[0];
                /*console.log(`Candidate Details:
                    Name: ${candidate.name}
                    Party: ${candidate.Party}
                    ID: ${candidate._id}
                    State: ${candidate.state}
                    Local Government: ${candidate.localGovernment}
                    Votes: ${candidate.votes}`);*/
            } else {
                console.log(`Candidate with ID ${candidateId} not found`);
            }
        }

        const vote = new Vote({
            userId: new mongoose.Types.ObjectId(userId),
            selectedOptions: selectedOptions,
        });

        await vote.save();

        await updateCandidateVotes(selectedOptions);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('An error occurred:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = { AuthVoter, AllowToVote, VerifyVote };

/*router.get('/voters', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hasVoted = await hasUserVoted(userId);
        if (hasVoted) {
            return res.status(403).json({ error: 'User has already voted' });
        }

        // Get categories and filter candidates based on user's state and local government
        const categories = await Category.find().populate('candidates');
        const filteredCategories = categories.map(category => {
            if (category.name === 'President') {
                // Display all candidates in the President category
                return category;
            } else if (category.name === 'Governor') {
                // Filter candidates by state for the Governor category
                category.candidates = category.candidates.filter(candidate => candidate.state === user.state);
            } else if (category.name === 'Chairman') {
                // Filter candidates by local government for the Chairman category
                category.candidates = category.candidates.filter(candidate => candidate.localGovernment === user.localGovernment);
            }
            return category;
        });

        res.status(200).json({ categories: filteredCategories });
        // Uncomment the line below to render a view instead
        // res.render('vote', { categories: filteredCategories });
    } catch (error) {
        console.error('An error occurred:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});*/
