const router = require('express').Router();
let Admin = require('../Model/Admin.model');

//get all the admins
router.route('/all').get((req,res)=>{
    Admin.find()
        .then(admins=>res.json(admins))
        .catch(err=>res.status(400).json('Error: '+err));
});

//adding admin
router.route('/add').post((req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const newAdmin = new Admin({username,password});
    console.log(req.body);

    newAdmin.save().then(()=> res.json('Admin added')).catch(err => res.status(400).json('Error'+ err));

});

module.exports = router;