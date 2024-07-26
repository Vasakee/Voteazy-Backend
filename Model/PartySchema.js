const mongoose = require('mongoose')

const PartySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    initials: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true,
        default: 'https:firebasestorage.googleapis.com/v0/b/musikk-e80a3.appspot.com/o/images%20%2F%20Anon.png?alt=media&token=a7d242ab-eeb2-4f4a-aaeb-037038e6910b'
    }
})

const Party = mongoose.model('Party', PartySchema)

module.exports = Party

/*logo: {
    type: String,
        required: true,
        default: 'https:firebasestorage.googleapis.com/v0/b/musikk-e80a3.appspot.com/o/images%20%2F%20Anon.png?alt=media&token=a7d242ab-eeb2-4f4a-aaeb-037038e6910b'
}*/