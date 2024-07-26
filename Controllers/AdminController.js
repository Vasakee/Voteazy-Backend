const expressAsyncHandler = require('express-async-handler')
const Admin = require('../Model/AdminSchema')
const jwt = require('jsonwebtoken')
const express = require('express')
const Router = express.Router()
const bcrypt = require('bcryptjs')


const JWT_SECRET = 'a5618230a39e5803c71a6c0bb8a225350426ccd34cd7bf4f1ec677577798bcc1506e0ec470c7dc797344d210d4a0a826c5f4f383276bf579f8df2efce38a4838'


const RegisterAdmin = expressAsyncHandler(async (req, res,) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400).json({ message: 'Please fill all required fields' })
        //throw new Error('Please fill all required fields')
    }
    const adminExists = await Admin.findOne({ email })

    if (adminExists) {
        res.status(400).json({ message: 'User already exists' })
        //throw new Error('User already exists')
    }
    const admin = await Admin.create({
        name,
        email,
        password,
    })
    if (admin) {
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            //password: admin.password,
            token: jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '30d' })
        })
    } else {
        res.status(400).json({ message: 'Failed to create user ' })
        //throw new Error('Failed to create user ')
    }
})

const AuthorizeAdmin = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body


    if (!email || !password) {
        res.status(400).json({ message: 'Please provide both email and password' })
        return
        //throw new Error('Please provide both email and password');
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
        res.status(400).json({ message: 'Email not found' })
        return
        //throw new Error('The email, or password is incorrect');
    }

    const isPasswordCorrect = await admin.checkPasswords(password);

    if (!isPasswordCorrect) {
        res.status(400).json({ message: 'Incorrect Password' })
        return
        //throw new Error('The email, or password is incorrect');
    }

    res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        //password: admin.password,
        token: jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '30d' })
    })
})

const GetAdmins = expressAsyncHandler(async (req, res) => {
    try {
        const admins = await Admin.find()
        res.status(200).json(admins)
    } catch (error) {
        console.log(error.message)
        throw new Error('An error occured')
    }
})

const GetAdmin = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const admin = Admin.findById(id)
        res.status(200).json(admin)
    } catch (error) {
        console.log(error.message)
        throw new Error('An error ocurred')
    }
})

const GetAdminByToken = Router.get('/', expressAsyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select('-password');
        if (admin) {
            res.status(200).json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}));

const DeleteAdmin = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const admin = Admin.findByIdAndDelete(id)
        if (admin) {
            return res.status(200).json({ message: 'Admin deleted successfully' })
        } else {
            res.status(404).json({ message: 'Admin not found' })
        }
    } catch (error) {
        console.log(error.message)
        throw new Error('An error occured')
    }
})


const TestPassword = Router.post('/test-hash', expressAsyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        res.status(400).json({ message: 'Please provide a password to hash' });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Original password:', password);
    console.log('Hashed password:', hashedPassword);

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password match status:', isMatch);

    res.json({
        originalPassword: password,
        hashedPassword,
        isMatch
    });
}));

module.exports = { RegisterAdmin, AuthorizeAdmin, GetAdmins, GetAdmin, GetAdminByToken, DeleteAdmin, TestPassword }