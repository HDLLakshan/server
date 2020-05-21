const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let creditcardSchema = new Schema({

    userName: {
        type: String
    },
    cno: {
        type: Number
    },
    nameCard: {
        type: String
    },
    month:{
        type: Number
    },
    year:{
        type:Number
    },
    cvc: {
        type: String
    }

}, {
    collection: 'creditcard'
})

module.exports = mongoose.model('Creditcard', creditcardSchema)