import mongoose from 'mongoose'

const addressBand = mongoose.Schema({
    region: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
})

const memberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    instrument: {
        type: String,
        required: true
    }
})

const socialLinksSchema = mongoose.Schema({
    platform: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    }
})


const bandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,

        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    address: [addressBand],

    members: [memberSchema],

    description: {
        type: String,
        required: true
    },
    musicalGenre: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },

    socialLinks: [socialLinksSchema],

    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Band', userSchema)