const nodemailer = require("nodemailer");
const router = require('express').Router();
let ProdMan = require('../Model/PM.model');

//get all the product managers
router.route('/all').get((req,res)=>{
    ProdMan.find()
        .then(admins=>res.json(admins))
        .catch(err=>res.status(400).json('Error: '+err));
});

//get product managers by ID
router.route('/:id').get((req,res)=>{
    ProdMan.findById(req.params.id).exec().then(user=>{
        res.json(user || {});
    }).catch(err=>{
        console.log(err);
        res.sendStatus(500);
    });
});

//adding product managers
router.route('/add').post((req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const newAdmin = new ProdMan({username,password,email});
    console.log(req.body);

    MailSender(req.body);
    newAdmin.save().then(()=> res.json('Product Manager added')).catch(err => res.status(400).json('Error'+ err));

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
        text: `Welcome to The Hanger Fashion Store staff\n`+
            `Here is your username and password\n`+
            `User name: ${User.username} \n`+
            `Password : ${User.password}\n`+
            `Thank you!`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//Deleting product managers
router.route('/:id').delete((req,res)=>{
    ProdMan.findOneAndDelete({username:req.params.id}).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.sendStatus(500);
    });
});

//Updating product managers
router.route('/:id').put((req,res)=>{
    ProdMan.findOneAndUpdate({username:req.params.id},{$set: req.body},{new:true}).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
});


module.exports = router;