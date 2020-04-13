let express = require('express');
let router = express.Router({mergeParams : true});

let shoppingCartSchema = require('../Model/ShoppingCart');

router.route('/add-to-cart').post((req, res, next)=>{
    shoppingCartSchema.create(req.body, (error,data) =>{
        if(error)
            return next(error);
        else
            return res.json(data);
    })
});

router.route('/check-product:ProductId').post((req, res) => {
    var query = {ProductId: req.params.ProductId};
    console.log("yako");
     console.log(query);
    shoppingCartSchema.find(query).exec().then(user => {
        res.json(user);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    })
});

router.route('/delete-product:ProductId').delete((req, res, next) => {
    var query = {ProductId : req.params.ProductId};
    shoppingCartSchema.remove(query, (error, data) => {
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


router.route('/get-cart').get((req, res,next) => {
    shoppingCartSchema.find((error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    })
});


module.exports = router;