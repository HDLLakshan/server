let express = require('express'),
    router = express.Router({mergeParams: true});
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../Validation/validator");
const validateLoginInput = require("../Validation/loginvalidator");
let userSchema = require('../Model/Users');
let db= require('../Database/db');


router.post("/register", (req, res) =>{
    const { errors, isValid } = validateRegisterInput(req.body);
    if(!isValid){
        return res.json(errors);
    }
    userSchema.findOne({ Email: req.body.Email }).then(user => {
        if (user) {
            return res.json({ Email: "Email already exists" });
        } else {
            const newUser = new userSchema({
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Username: req.body.Username,
                Email : req.body.Email,
                PasswordOne : req.body.PasswordOne
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.PasswordOne, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.PasswordOne = hash;
                    newUser
                        .save()
                        .then()
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
// Check validation
    if (!isValid) {
        return res.json(errors);
    }
    const Username = req.body.Username;
    const Password = req.body.Password;

    userSchema.findOne({ Username }).then(user => {
        // Check if user exists
        if (!user) {
            return res.json({ Username: "Username not found" });
        }

        bcrypt.compare(Password, user.PasswordOne).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };

                jwt.sign(
                    payload,
                    db.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .json({ Password: "Password incorrect" });
            }
        });
    });
});

router.post("/getOne:Username", (req, res) => {
console.log(req.params.Username);
    userSchema.findOne({ Username: req.params.Username }).then(user => {
        return res.json(user);
    });


});

router.route('/edit-details:Email').put((req, res, next) => {
    var query = {Email: req.params.Email};
    console.log(req.body);
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.PasswordOne, salt, (err, hash) => {
            if (err) throw err;
            const newUser = new userSchema({
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Username: req.body.Username,
                Email: req.body.Email,
                PasswordOne: hash
            });

            console.log(newUser);

            userSchema.remove(query, (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    newUser
                        .save()
                        .then(res.json(data))
                        .catch(err => console.log(err));
                }
            });
            // userSchema.updateOne(query, {$set: newUser}, (error, data) => {
            //     if (error) {
            //         return next(error);
            //     } else {
            //         res.json(data);
            //         res.status(200).json({
            //             msg: data
            //         })
            //     }
            // })
        });
    });
});

// router.put("/edit-details", (req, res, next)=> {
//     // userSchema.findOne({Email: req.body.Email}).then(user => {
//     //     if (user) {
//     //         const id = user.id;
//             const newUser = new userSchema({
//                 FirstName: req.body.FirstName,
//                 LastName: req.body.LastName,
//                 Username: req.body.Username,
//                 PasswordOne: req.body.PasswordOne
//             });
//             bcrypt.genSalt(10, (err, salt) => {
//                 bcrypt.hash(newUser.PasswordOne, salt, (err, hash) => {
//                     if (err) throw err;
//                     newUser.PasswordOne = hash;
//                     userSchema.updateOne(
//                         {Email:req.body.Email},
//                         {$set:{
//                                 FirstName: req.body.FirstName,
//                                 LastName: req.body.LastName,
//                                 Username: req.body.Username,
//                                 PasswordOne: req.body.PasswordOne
//                             }
//                     }.then(res => {
//                             res.json(res.data);
//                         }));
//                 });
//                 });
//                 //userSchema.findByIdAndUpdate(id,{$set: newUser})
//
//             // });
//     //     }
//     // })
// });

module.exports = router;
