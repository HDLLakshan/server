let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

// Creditcard Model
let creditcardSchema = require('../Model/Creditcard');

// Add credit card
router.route('/add-creditcard').post((req, res, next) => {
    creditcardSchema.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(data)
            res.json(data)
        }
    })
});

// READ credit card
router.route('/get-creditcard').get((req, res) => {
    creditcardSchema.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/update-creditcard/:id').put((req,res) => {
    var Query = {userName : req.params.id}
    creditcardSchema.findOneAndUpdate(Query,{
            $set: req.body
        },
        (error,data) => {

            if (error) {
                return next(error)
            } else {
                res.json(data)
                console.log("credit card updated successfully")
            }
        })
})

router.route('/get-single-creditcard/:username').get((req,res,next) => {
    creditcardSchema.findOne({userName: req.params.username}, (error,data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('successfully retrieved' )
        }
    })
})


// Delete payment
router.route('/delete-credit-card/:id').delete((req, res, next) => {
    creditcardSchema.findOneAndRemove({userName:req.params.id}, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

router.route('/delete-creditcard/:id').delete((req, res, next) => {
    creditcardSchema.findByIdAndRemove(req.params.id, (error, data) => {
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