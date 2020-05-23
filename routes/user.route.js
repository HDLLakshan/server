let express = require('express'), router = express.Router({mergeParams: true});
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../Validation/validator");
const validateLoginInput = require("../Validation/loginvalidator");
let userSchema = require('../Model/Users');
let db = require('../Database/db');
const db1 = require("../Model");
const Role = db1.role;


router.post("/register", (req, res, next) => {
    const {errors, isValid} = validateRegisterInput(req.body);
    console.log(errors);
    if (!isValid) {
        return res.json(errors);
    }
    userSchema.findOne({Email: req.body.Email}).then(user => {
        if (user) {
            return res.json({Email: "Email already exists"});
        } else {
            // const newUser = new userSchema({
            //     FirstName: req.body.FirstName,
            //     LastName: req.body.LastName,
            //     Username: req.body.Username,
            //     Email : req.body.Email,
            //     PasswordOne : req.body.PasswordOne
            // });
            // bcrypt.genSalt(10, (err, salt) => {
            //     bcrypt.hash(newUser.PasswordOne, salt, (err, hash) => {
            //         if (err) throw err;
            //         newUser.PasswordOne = hash;
            //         newUser
            //             .save()
            //             .then()
            //             .catch(err => console.log(err));
            //     });
            // });

            console.log(req.body.roles);
            if (req.body.roles) {
                var query = {name: req.body.roles};
                Role.findOne(query, (erro, roles) => {
                        if (erro) {
                            res.status(500).send({message: erro});
                            return;
                        }

                        const newUser = new userSchema({
                            FirstName: req.body.FirstName,
                            LastName: req.body.LastName,
                            Username: req.body.Username,
                            Email: req.body.Email,
                            PasswordOne: req.body.PasswordOne,
                            roles: roles._id
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
                        console.log("user registered");
                    }
                );
            } else {
                Role.findOne({name: "user"}, (err, role) => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }

                    const newUser1 = new userSchema({
                        FirstName: req.body.FirstName,
                        LastName: req.body.LastName,
                        Username: req.body.Username,
                        Email: req.body.Email,
                        PasswordOne: req.body.PasswordOne,
                        roles: role._id
                    });
                    console.log(newUser1);
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser1.PasswordOne, salt, (err, hash) => {
                            if (err) throw err;
                            newUser1.PasswordOne = hash;
                            newUser1
                                .save()
                                .then()
                                .catch(err => console.log(err));
                        });
                    });
                });
            }
        }

    });
});

router.post("/login", (req, res) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    const {errors, isValid} = validateLoginInput(req.body);
// Check validation
    if (!isValid) {
        return res.json(errors);
    }
    const Username = req.body.Username;
    const Password = req.body.Password;

    userSchema.findOne({Username}).then(user => {
        // Check if user exists
        if (!user) {
            return res.json({Username: "Username not found"});
        }
        bcrypt.compare(Password, user.PasswordOne).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };

                var token = jwt.sign(
                    payload,
                    db.secretOrKey,
                    {
                        expiresIn: 86400 // 1 year in seconds
                    },
                    // (err, token) => {
                    //     res.json({
                    //         success: true,
                    //         token: "Bearer " + token
                    //     });
                    // }
                );

                var authorities = [];
                var query = {id: user.roles[0]};
                Role.findById(user.roles[0], null, null, (err, roles) => {

                    if (user.roles.length === 1) {
                        authorities.push("ROLE_" + roles.name.toUpperCase());
                    }

                    res.json({
                        username: user.Username,
                        success: true,
                        roles: authorities,
                        accessToken: token
                    });
                });

            } else {
                return res
                    .json({Password: "Password incorrect"});
            }
        });
    });
});

router.post("/getOne:Username", (req, res) => {
    console.log(req.params.Username);
    userSchema.findOne({Username: req.params.Username}).then(user => {
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

router.route('/delete:Email').delete((req, res, next) => {
    userSchema.findOneAndDelete({email: req.params.Email}).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
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

router.route('/all').get((req, res) => {
    userSchema.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
