const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ratingSchema = new Schema({

    productId:{
        type:String
    },
    RateComment:[],
    Total:{
        type:Number
    },
    Count:{
        type:Number
    },
    Rate:{
        type:Number
    }

}, {
    collection: 'rating'
})

module.exports = mongoose.model('Rating', ratingSchema)