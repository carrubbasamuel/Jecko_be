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
    cover: {
        type: String,
        default: "https://media.istockphoto.com/id/1266312623/id/vektor/lapangan-basket-di-taman-kota.jpg?s=170667a&w=0&k=20&c=0wR7FnT84EfggbuBXfzBz_GjExwUpXszAr5rJ7nHs5M=",
        required: true
    },
    haveEvents: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, strict: true });



module.exports = mongoose.model('SportFildsLocation', SchemaLocation, 'SportFildsLocation');