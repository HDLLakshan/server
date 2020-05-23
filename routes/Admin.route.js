const nodemailer = require("nodemailer");
const router = require('express').Router();
let ProdMan = require('../Model/PM.model');
let userSchema = require('../Model/Users');
const db1 = require("../Model");
const bcrypt = require("bcryptjs");
const Role = db1.role;



//get all the product managers
router.route('/all').get((req, res) => {
    ProdMan.find()
        .then(admins => res.json(admins))
        .catch(err => res.status(400).json('Error: ' + err));
});

//get product managers by ID
router.route('/:id').get((req, res) => {
    ProdMan.findById(req.params.id).exec().then(user => {
        res.json(user || {});
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});

//adding product managers
router.route('/add').post(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const newAdmin = new ProdMan({username, password, email});
    console.log(req.body);

    userSchema.findOne({Email: email}).then(user => {
        if (user) {
            return res.sendStatus(208);
        } else {
            Role.findOne({name: "moderator"}, (err, role) => {

                const newUser = new userSchema({
                    FirstName: 'none',
                    LastName: 'none',
                    Username: username,
                    Email: email,
                    PasswordOne: password,
                    roles: role._id
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.PasswordOne, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.PasswordOne = hash;
                        newUser.save().then(() => {
                            newAdmin.save().then(() => {
                                MailSender(req.body);
                                return res.sendStatus(200)
                            }).catch(err => res.status(400).json('Error' + err));
                        }).catch(err => console.log(err));
                    });
                });
            });
        }
    });


});

function MailSender(User) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hanger24x7@gmail.com',
            pass: '1qaz2wsx@'
        }
    });

    var mailOptions = {
        from: 'hanger24x7@gmail.com',
        to: User.email,
        subject: 'Login Details',
        text: `Welcome to The Hanger Fashion Store staff\n` +
            `Here is your username and password\n` +
            `User name: ${User.username} \n` +
            `Password : ${User.password}\n` +
            `Thank you!`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//Deleting product managers
router.route('/:email').delete((req, res) => {
    ProdMan.findOneAndDelete({email: req.params.email}).then(() => {
        userSchema.findOneAndDelete({Email: req.params.email}).then(() => {}).catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });



});

//Updating product managers
router.route('/:email').put((req, res) => {
    let ProdManUser ={
        username: req.body.username,
        password: req.body.password
    };
    let User ={
        Username: req.body.username,
        PasswordOne: req.body.password
    };
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(User.PasswordOne, salt, (err, hash) => {
            if (err) throw err;
            User.PasswordOne = hash;
        });
    });

    ProdMan.findOneAndUpdate({email: req.params.email}, {$set: ProdManUser}, {new: true}).then(() => {
        console.log(User)
        userSchema.findOneAndUpdate({Email: req.params.email}, {$set: User}, {new: true}).then(() => {
            res.sendStatus(200);
        }).catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });

});


module.exports = router;
