const mongoose = require('mongoose');

const SchemaLocation = mongoose.Schema({
    geo: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    name: {
        type: String,
        required: true
    },
    genere: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
}, { timestamps: true, strict: true });



module.exports = mongoose.model('SportFildsLocation', SchemaLocation, 'SportFildsLocation');