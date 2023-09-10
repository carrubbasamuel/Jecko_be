const mongoose = require('mongoose');


const SchemaMessage = new mongoose.Schema({
    id_room: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        required: true,
    },
    read: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    isJoinMessage: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, strict: true });


module.exports = mongoose.model('Message', SchemaMessage, 'Message');