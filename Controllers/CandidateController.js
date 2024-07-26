const { Candidate, Category, Vote } = require('../Model/VoteSchema')
const Party = require('../Model/PartySchema')
const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const { verifyAdmin } = require('../Config/functions')
const Router = express.Router()


const RegisterCandidate = expressAsyncHandler(async (req, res) => {
    const { name, party, state, localGovernment, votes, Pic } = req.body
    const categoryName = req.params.categoryName;

    try {
        const partyExists = await Party.findOne({ name: party })

        if (!partyExists) {
            return res.status(400).json({ message: 'Party does not exist' });
        }

        var category = await Category.findOne({ name: categoryName })

        if (!category) {
            category = new Category({ name: categoryName, candidates: [] })
        }
        if (!name || !party || !state || !localGovernment) {
            res.status(400);
            throw new Error('Please fill all required fields')
        }

        const candidate = new Candidate({
            name,
            party,
            state,
            localGovernment,
            Pic,
            votes: 0
        })
        category.candidates.push(candidate)

        await category.save()
        res.status(201).json({
            _id: candidate._id,
            name: candidate.name,
            party: candidate.party,
            state: candidate.state,
            localGovernment: candidate.localGovernment,
            votes: candidate.votes,
            Pic: candidate.Pic
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('failed to create candidate')
    }
})

const GetCandidatesCategory = expressAsyncHandler(async (req, res) => {
    const categoryName = req.params.categoryName

    try {
        const category = await Category.findOne({ name: categoryName })

        if (!category) {
            return res.status(404).send('category not found')
        }
        res.json(category.candidates)
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occured')
    }
})

const GetCandidates = expressAsyncHandler(async (req, res) => {
    try {
        const AllCategories = await Category.find();

        const AllCandidates = AllCategories.map(category => ({
            category: category.name,
            candidates: category.candidates
        }))
        res.json(AllCandidates)
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occured')
    }
})

const GetCandidate = expressAsyncHandler(async (req, res) => {
    const { candidateId } = req.params;

    try {
        const category = await Category.findOne({ 'candidates._id': candidateId }, { 'candidates.$': 1 });

        if (!category) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.json(category.candidates[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const DeleteCandidate = expressAsyncHandler(async (req, res) => {
    const { categoryName, candidateId } = req.params;

    try {
        const category = await Category.findOne({ name: categoryName });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const candidateIndex = category.candidates.findIndex(candidate => candidate._id.toString() === candidateId);

        if (candidateIndex === -1) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        category.candidates.splice(candidateIndex, 1);
        await category.save();

        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});



module.exports = { RegisterCandidate, GetCandidatesCategory, GetCandidates, GetCandidate, DeleteCandidate }