let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

// Rating Model
let ratingSchema = require('../Model/Rating');

// Products
let ProductSchema = require('../Model/Products');

router.route('/add-rating1/:id').put((req, res) => {
    ratingSchema.update(
        {productId:req.params.id},
        {
            $push : {
                "RateComment":{
                    "userid" : req.body.userName,
                    "comment" : req.body.comment,
                    "rateno" : req.body.ratingno,
                }
            }
        },{safe: true, upsert: true,new:true},
        function(err, model) {
            console.log(err);
        }).then(() => {
        console.log("llll")
        res.sendStatus(200);
    })
})

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
            //update product schema with new rate
            ProductSchema.findOneAndUpdate(
                {_id:req.body.productId},
                {
                    $set: {
                        TotRate :req.body.ratingno
                    }
                },
                {new: true}).then(() => console.log('updated')).catch(err => console.log(err));


        }else{
            data.RateComment.push({
                "userid" : req.body.userName,
                "comment" : req.body.comment,
                "rateno" : req.body.ratingno,
            })
            data.Total = data.Total + req.body.ratingno,
                data.Count = data.Count + 1,
                data.Rate = (data.Total )/(data.Count )
            ratingSchema.findOneAndUpdate(
                {_id:data._id},{
                    $set:data
                }
              ,{safe: true, upsert: true,new:true},
                function(err, model) {
                    console.log(err);
                }).then(() => {
                    console.log("llll")
                res.sendStatus(200);
            })
            console.log(data.RateComment)
            //update product schema with new rate
            ProductSchema.findOneAndUpdate(
                {_id:req.body.productId},
                {
                    $set: {
                        TotRate :(data.Total)/(data.Count)
                    }
                },
                {new: true}).then(() => console.log('updated')).catch(err => console.log(err));
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

//get product rate and comments
router.route('/get-rate/:id').get((req,res) => {
    var Query = {userName : req.params.id}
    ratingSchema.findOne(Query, (error,data) => {
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