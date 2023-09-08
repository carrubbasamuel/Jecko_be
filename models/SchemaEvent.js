const mongoose = require('mongoose');

const SchemaEvent = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    dateStart: {
        type: Date,
        required: true
    },
    dateEnd: {
        type: Date,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SportFildsLocation'
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    description: {
        type: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    id_room: {
        type: String,
        required: true
    }
}, { timestamps: true, strict: true });



module.exports = mongoose.model('Event', SchemaEvent, 'Event');