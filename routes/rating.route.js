let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

// Rating Model
let ratingSchema = require('../Model/Rating');

// Add Rating
router.route('/add-rating').post((req, res, next) => {

    ratingSchema.findOne({"productId" : req.body.productId}, (error,data) => {
        if(data === null){
            const rs = new ratingSchema();
            rs.productId = req.body.productId
            rs.Total=req.body.ratingno
            rs.Count = 1
            rs.Rate = req.body.ratingno
            rs.RateComment.push({
                "userid" : req.body.userName,
                "comment" : req.body.comment,
                "rateno" : req.body.ratingno,
            })

            rs.save().then(() => {
                res.sendStatus(200);
            }).catch(err => console.log(err))
        }else{
            ratingSchema.findOneAndUpdate({"productId":req.body.productId},{
                    $push : {
                        "RateComment":{
                            "userid" : req.body.userName,
                            "comment" : req.body.comment,
                            "rateno" : req.body.ratingno,
                        }
                    },
                    $set : {
                        "Total" : data.Total + req.body.ratingno,
                        "Count" : data.Count + 1,
                        "Rate" : (data.Total + req.body.ratingno)/(data.Count + 1)
                    }
                },{safe: true, upsert: true, new : true},
                function(err, model) {
                    console.log(err);
                }).then(() => {
                res.sendStatus(200);
            })
        }
    })


});
//get product rate and comments
router.route('/get-rate-comments/:id').get((req,res) => {
    var Query = {productId : req.params.id}
    ratingSchema.find(Query, (error,data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

// get all ratings and comments
router.route('/get-rating').get((req, res) => {
    ratingSchema.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})



// Delete rating
router.route('/delete-rating/:id').delete((req, res, next) => {
    ratingSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})



module.exports = router;