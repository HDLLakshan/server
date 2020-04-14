const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let billingSchema = new Schema({
    userName: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    add1: {
        type: String
    },
    add2: {
        type: String
    },
    city: {
        type: String
    },
    State: {
        type: String
    },
    zip: {
        type: Number
    },
    country: {
        type: String
    },
    pno: {
        type: String
    },
    instructions: {
        type: String
    },
    deliveryadd:{
        type: String
    },
    cashDelivery:{
        type:Boolean
    }




}, {
    collection: 'billing'
})

module.exports = mongoose.model('Billing', billingSchema)