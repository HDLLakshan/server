let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

// Billing Model
let billingSchema = require('../Model/Billing');


// CREATE Billing
router.route('/add-billing').post((req, res, next) => {
    billingSchema.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(data)
            res.json(data)
        }
    })
});

// READ Billing
router.route('/get-billing').get((req, res) => {
    billingSchema.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/update-bill/:id').put((req,res) => {
    var Query = {userName : req.params.id}
    billingSchema.findOneAndUpdate(Query,{
            $set: req.body
        },

        (error,data) => {

        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/get-one-bill/:username').get((req,res) => {
    billingSchema.findOne({userName: req.params.username}, (error,data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('successfully retrieved a bill!' )
        }
    })
})

// Delete Single Bill
router.route('/delete-billing/:id').delete((req, res, next) => {
    billingSchema.findByIdAndRemove(req.params.id, (error, data) => {
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