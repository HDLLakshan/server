const mongoose = require('mongoose');

let wishListSchema = new mongoose.Schema({
    ProductId: {
        type:String
    },
    ProductName: {
        type: String
    },
    Category: {
        type: String
    },
    PricePerUnit: {
        type: Number
    },
    SubCategory: {
        type: String
    },
    ImageOfProduct: {
        type: String
    },
    Quantity: {
        type: Number
    }
}, {
    collection : 'wishlist'
});

module.exports = mongoose.model('WishList', wishListSchema);