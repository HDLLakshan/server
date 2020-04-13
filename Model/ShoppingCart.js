const mongoose = require('mongoose');

let shoppingCart = new mongoose.Schema({
    ProductId: {
        type: String
    },
    PricePerUnit:{
        type: Number
    },
    Quantity: {
        type: Number
    },
    ImagePath:{
        type: String
    }
}, {
    collection : 'shoppingcart'
});



module.exports = mongoose.model('shoppingcart', shoppingCart);