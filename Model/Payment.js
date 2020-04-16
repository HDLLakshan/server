const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let paymentSchema = new Schema({

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
    collection: 'payment'
})

module.exports = mongoose.model('Payment', paymentSchema)