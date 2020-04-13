let express = require('express'),
    router = express.Router({mergeParams: true});
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../Validation/validator");
const validateLoginInput = require("../Validation/loginvalidator");
let userSchema = require('../Model/Users');
let db= require('../Database/db');


//router.route('/create-user').post((req, res, next) => {
  router.post("/register", (req, res) =>{

    const { errors, isValid } = validateRegisterInput(req.body);
      console.log("dsdsd");

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
            console.log("jsjsjs");
console.log(newUser);
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

//     userSchema.create(req.body, (error,data) =>{
//         if(error){
//             return next(error);
//         }else{
//             console.log(data);
//             res.json(data);
//         }
//     })
// });

// router.route('/check-user:Username').post((req, res) => {
//     var query = {Username : req.params.Username};
//     // console.log(query);
//     // console.log(req.params.Username);
//     userSchema.find(query).exec().then(user =>{
//         res.json(user);
//     }).catch(err => {
//         console.error(err);
//         res.sendStatus(500);
//         });
// });

router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
// Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const Username = req.body.Username;
    const Password = req.body.Password;

    userSchema.findOne({ Username }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ usernamenotfound: "Username not found" });
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
                        console.log(token);
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
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
    console.log("bbbbbbbb");
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
