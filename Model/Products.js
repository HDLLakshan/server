const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ProductName: {
        type: String,
        weight:10
    },
    ProductBrand: {
      type:String,
        weight: 5
    },
    Category: {
        type: String,
        weight: 8
    },
    PricePerUnit: {
        type: Number,
        weight:7
    },
    SubCategory: {
        type: String,
        weight:7
    },
    Discount: {
        type: Number
    },
    AddDate: {
        type:String,
    },
    Details:[],
    TotRate:{
        type:Number
    }
}, {
    collection: 'products'
    });
productSchema.index({'$**': 'text'});



module.exports = mongoose.model('Product', productSchema);
