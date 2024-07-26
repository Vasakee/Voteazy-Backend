const jwt = require('jsonwebtoken');
const JWT_SECRET = 'a5618230a39e5803c71a6c0bb8a225350426ccd34cd7bf4f1ec677577798bcc1506e0ec470c7dc797344d210d4a0a826c5f4f383276bf579f8df2efce38a4838'

const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId;
        next();
    });
};

module.exports = verifyJWT;