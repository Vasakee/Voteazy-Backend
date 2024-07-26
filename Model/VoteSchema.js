const mongoose = require('mongoose')

// candidate schema
const CandidateSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    localGovernment: {
        type: String,
        required: true
    },
    Pic: {
        type: String,
        required: true,
        default: 'https:firebasestorage.googleapis.com/v0/b/musikk-e80a3.appspot.com/o/images%20%2F%20Anon.png?alt=media&token=a7d242ab-eeb2-4f4a-aaeb-037038e6910b',
    },
    votes: {
        type: Number,
        default: 0
    }
})

//category schema 
const CategorySchema = mongoose.Schema({
    name: String,
    candidates: [CandidateSchema]
})

const VoteSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    selectedOptions: [{
        type: String,
        required: true,
    }],
    timeStamp: {
        type: Date,
        default: Date.now,
    }
})

const Candidate = mongoose.model('Candidate', CandidateSchema)
const Category = mongoose.model('Category', CategorySchema)
const Vote = mongoose.model('Vote', VoteSchema)

module.exports = {
    Candidate,
    Category,
    Vote
}