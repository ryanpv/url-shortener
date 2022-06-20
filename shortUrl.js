const mongoose = require('mongoose');
const shortId = require('shortid');

const shortUrlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate // provides object item with shortid since no input for the short is provided during POST request
        // default helps to apply the newly generated shortId to this object as it's value is not defined
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)
// model() method that creates db collection - syntax is collection name, schema of collection