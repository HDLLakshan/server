const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    StockAmount: {
        type: Number
    }
}, {
    collection: 'products'
    })


module.exports = mongoose.model('Product', productSchema);
