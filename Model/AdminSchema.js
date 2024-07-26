const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
    }
})

//AdminSchema.methods.checkPasswords = async function (PasswordInput) {
//    return await bcrypt.compare(PasswordInput, this.password)
//}

AdminSchema.methods.checkPasswords = async function (PasswordInput) {
    console.log('Comparing passwords:', PasswordInput, this.password);
    return await bcrypt.compare(PasswordInput, this.password);
};

AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//AdminSchema.pre('save', async function (next) {
//    if (!this.isModified(this.password)) {
//        return next()
//    }

//    const salt = await bcrypt.genSalt(10)
//    this.password = bcrypt.hash(this.password, salt)
//})

const Admin = mongoose.model('Admin', AdminSchema)

module.exports = Admin