const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name:{
        type: String,
        required: true,
        unique:true,
        trim:true
    },
    subCategory:{
        type:Array
    },
    slug:{
        type:String,
        required: true
    },
    description:{
        type:String
    }
},{
    timestamps:true
});

const category = mongoose.model('Categories',CategorySchema);
module.exports = category;