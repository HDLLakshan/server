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

router.route('/check-product:userId').post((req, res) => {
    var query = {UserId : req.params.userId};
    wishlistSchema.find(query).exec().then(user =>{
        console.log(user);
        res.json(user);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    })
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