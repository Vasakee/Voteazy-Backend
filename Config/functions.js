const { Vote, Category, Candidate } = require('../Model/VoteSchema')
const Admin = require('../Model/AdminSchema')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'a5618230a39e5803c71a6c0bb8a225350426ccd34cd7bf4f1ec677577798bcc1506e0ec470c7dc797344d210d4a0a826c5f4f383276bf579f8df2efce38a4838'

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'User not authenticated' });
    }
}

async function hasUserVoted(userId) {
    try {
        const vote = await Vote.findOne({ userId });
        return vote !== null;
    } catch (error) {
        console.error('Error checking if user has voted:', error.message);
        return false;
    }
}

async function updateCandidateVotes(selectedOptions) {
    try {
        for (const candidateId of selectedOptions) {
            const category = await Category.findOne({ "candidates._id": candidateId })
            if (category) {
                const candidate = category.candidates[0];
                console.log(`Candidate Details:
                    Name: ${candidate.name}
                    Party: ${candidate.Party}
                    ID: ${candidate._id}
                    State: ${candidate.state}
                    Local Government: ${candidate.localGovernment}
                    Votes: ${candidate.votes}`);
                const result = await Category.updateOne(
                    { "candidates._id": candidateId }, { $inc: { "candidates.$.votes": 1 } }
                )
                if (result.nModified > 0) {
                    const updatedCategory = await Category.findOne({ "candidates._id": candidateId })
                    const updatedCandidate = updatedCategory.candidates.id(candidateId)

                    console.log(`Updated Candidate Details:
                    Name: ${updatedCandidate.name}
                    Party: ${updatedCandidate.party}
                    State: ${updatedCandidate.State}
                    Local Government: ${updatedCandidate.localGovernment}
                    Votes: ${updatedCandidate.votes}
                    `)
                } else {
                    console.log(`Failed to update votes for candidate ${candidateId}`);
                }
            } else {
                console.log(`Category with candidate ID ${candidateId} not found`);
            }

        }
    } catch (error) {
        console.error('Error updating candidate votes:', error.message);
    }
}

const verifyAdmin = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({ message: 'Admin not found, authorization denied' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { authMiddleware, hasUserVoted, updateCandidateVotes, verifyAdmin }