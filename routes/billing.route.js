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

router.route('/update-billing/:id').put((req, res, next) => {
    billingSchema.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('successfully updated billing !')
        }
    })
})

// Delete Student
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

// Get Single Student
router.route('/get-one-billing/:id').get((req, res) => {
    purchasingSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data);
        }
    })
})

module.exports = router;