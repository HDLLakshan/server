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

router.route('/check-product:productId').post((req, res) => {
    console.log("brppppp came ehere ");
    var query = {ProductId : req.params.productId};
    console.log(query);
    console.log(req.params.productId);
    wishlistSchema.find(query).exec().then(user =>{
        res.json(user);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    })
    // var query = {name : req.params.name};
    // wishlistSchema.count(query, function(err, count) {
    //
    //     if (count>0) {
    //         //console.log(count);
    //
    //     } else {
    //         console.log(count);
    //     }
    //
    // })  //res.json(user);
});

router.route('/delete-product:productId').delete((req, res, next) => {
    var query = {ProductId : req.params.productId};
    wishlistSchema.remove(query, (error, data) => {
        if (error) {
            return next(error);
        } else {
            //res.json(data);
            res.status(200).json({
                msg: data
            })
        }
    })
});

router.route('/get-wishlist').get((req, res,next) => {
    wishlistSchema.find((error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    })
});




module.exports = router;