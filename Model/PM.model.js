const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductManagerSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required: true,
        minlength:6
    },
    email:{
        type:String,
        required: true,
    }
},{
    timestamps:true
});

const ProdMan = mongoose.model('ProdManagers',ProductManagerSchema);
module.exports = ProdMan;