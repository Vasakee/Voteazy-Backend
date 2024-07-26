const Party = require('../Model/PartySchema')
const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const { verifyAdmin } = require('../Config/functions')
const Router = express.Router()


//const PostParty
const RegisterParty = expressAsyncHandler(async (req, res) => {
    const { name, initials, logo } = req.body

    if (!name || !initials) {
        res.status(400);
        throw new Error('Please fill all required fields')
    }
    const partyExists = await Party.findOne({ name })

    if (partyExists) {
        res.status(400).json({ message: 'Party already exists' })
        return
        //throw new Error('Party already exists')
    }
    const party = await Party.create({
        name, initials, logo
    })

    if (party) {
        res.status(201).json({
            _id: party._id,
            name: party.name,
            initials: party.initials,
            logo: party.logo
        })
    } else {
        res.status(400)
        throw new Error('Failed to create party')
    }
})

//const GetParties
const GetParties = expressAsyncHandler(async (req, res) => {
    try {
        const parties = await Party.find()
        res.status(200).json(parties)
    } catch (error) {
        console.log(error.message)
        throw new Error('An error occured')
    }
})

const GetParty = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const party = Party.findById(id)
        res.status(200).json(party)
    } catch (error) {
        console.log(error.message)
        throw new Error('An error occured')
    }
})

const DeleteParty = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const party = await Party.findByIdAndDelete(id);
        if (party) {
            return res.status(200).json({ message: 'Party deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Party not found' });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'An error occurred' });
    }
});

module.exports = { RegisterParty, GetParties, GetParty, DeleteParty }