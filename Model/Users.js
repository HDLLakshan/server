const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required:true
    },
    LastName: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required:true
    },
    Email: {
        type: String,
        required:true
    },
    PasswordOne: {
        type: String,
        required:true
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
}, {
    collection: 'users'
});

module.exports = mongoose.model('User',userSchema);