import mongoose from "mongoose"

const addressBand = mongoose.Schema({
    region: {
        type: String,
        required: true,
        trim: true,
    },

    state: {
        type: String,
        required: true,
        trim: true,
    },
    
    city: {
        type: String,
        required: true,
        trim: true,
    },
})

const memberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    instrument: {
        type: String,
        required: true,
        trim: true,
    },
})

const socialLinksSchema = mongoose.Schema({
    platform: {
        type: String,
        required: true,
        trim: true,
    },

    url: {
        type: String,
        required: true,
        trim: true,
    },
})

const bandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
    },

    address: {
        type: addressBand,
        required: true,
    },

    members: {
        type: [memberSchema],
        required: true,
        validate: v => v.length > 0,
    },

    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear(),
    },

    musicalGenre: {
        type: String,
        trim: true,
        required: true,
    },

    description: {
        type: String,
        trim: true,
        default: "",
    },

    image: {
        type: String,
        default: "",
    },

    socialLinks: {
        type: [socialLinksSchema],
        default: [],
    },

}, { timestamps: true })

export default mongoose.model("Band", bandSchema)
