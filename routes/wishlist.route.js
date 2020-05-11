const jwt = require("jsonwebtoken");
const config = require("../Database/db");
let express = require('express');
let router = express.Router({mergeParams : true});

let wishlistSchema = require('../Model/WishList');

router.route('/add-to-wishlist').post((req, res, next)=>{
    wishlistSchema.create(req.body, (error,data) =>{
        if(error)
            return next(error);
        else
            return res.json(data);
    })
});

router.route('/check-product:userId').post((req, res, next) => {
    let token = req.headers["x-access-token"];
    console.log("1");
    console.log(token);
    if (!token) {
        res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, config.secretOrKey, (err, decoded) => {
        console.log("4");
        console.log(decoded);
        if (err) {
            console.log("5");
            res.status(401).send({ message: "Unauthorized!" });
        }else{
            console.log("6");
            if(decoded.id === req.params.userId){
                console.log("7");
                var query = {UserId : req.params.userId};
                wishlistSchema.find(query).exec().then(user =>{
                    console.log("8");
                    console.log(user);
                    res.json(user);
                }).catch(error => {
                    console.log("9");
                    console.error(error);
                    console.log("10");
                    res.sendStatus(500);
        })
}

        }

        // req.userId = decoded.id;
        // next();
    });


    // console.log("choooo")
    // var verify;
    // async function f() {
    //     verify = await authJwt.verifyToken(req,res,next);
    // }
    // if(verify){
    //     var query = {UserId : req.params.userId};
    //     wishlistSchema.find(query).exec().then(user =>{
    //         console.log(user);
    //         res.json(user);
    //     }).catch(err => {
    //         console.error(err);
    //         res.sendStatus(500);
    //     })
    // }else{
    //     return res.status(401).send({ message: "Unauthorized!" });
    // }
});

router.route('/edit-details:userId').put((req, res, next) => {
    var query = {UserId: req.params.userId};

    wishlistSchema.updateOne(query, {$set:{ProductObject: req.body}}, (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    console.log(data);
                    return res.json(data);
                }
            })

});


module.exports = router;