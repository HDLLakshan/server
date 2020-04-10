const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ProductName: {
        type: String
    },
    ProductBrand:{
        type:String
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
    ImageOfProduct:  {
        type: Array
    },
    ColorOfImg: {
        type:Array
    },

    StockAmount: {
        type: Number
    },
    StockOfItem: {
        type:Array
    }
}, {
    collection: 'products'
    })


module.exports = mongoose.model('Product', productSchema);
