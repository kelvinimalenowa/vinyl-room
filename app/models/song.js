const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    artist: {
        type: String,
        required: true,
        trim: true
    },

    album: {
        type: String,
        trim: true,
        default: ''
    },

    genre: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true,
        default: ''
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    albumArt: {
        type: String,
        default: null
    },

    spotifyId: {
        type: String,
        default: null
    },

    spotifyUrl: {
        type: String,
        default: null
    },

    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

}, {
    timestamps: true
})

module.exports = mongoose.model('Song', songSchema)