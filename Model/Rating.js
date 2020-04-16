const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ratingSchema = new Schema({

    userName: {
        type: String
    },
    productId: {
        type: String
    },
    ratingno: {
        type: Number
    },
    comment:{
        type: String
    }

}, {
    collection: 'rating'
})

module.exports = mongoose.model('Rating', ratingSchema)