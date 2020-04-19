const mongoose = require('mongoose');

let wishListSchema = new mongoose.Schema({
    UserId: {
        type:String
    },
    ProductObject:{
        type : Array , "default" : []
    }
}, {
    collection : 'wishlist'
});

module.exports = mongoose.model('WishList', wishListSchema);