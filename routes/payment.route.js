let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

// Payment Model
let paymentSchema = require('../Model/Payment');

// Add payment
router.route('/add-payment').post((req, res, next) => {
    paymentSchema.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(data)
            res.json(data)
        }
    })
});

// READ Payment
router.route('/get-payment').get((req, res) => {
    paymentSchema.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

router.route('/update-payment/:id').put((req, res, next) => {
    paymentSchema.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('payment updated successfully !')
        }
    })
})

// Delete payment
router.route('/delete-payment/:id').delete((req, res, next) => {
    paymentSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

// Get Single payment
router.route('/single-payment/:id').get((req, res) => {
    paymentSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data);
        }
    })
})

router.route('/getpayment/:id').get((req,res) => {
    var Query = {userName : req.params.id}
    paymentSchema.find(Query,(error,data) => {
        if(error){
            return next(error)

        }else{
            res.json(data)
        }
    })
})

module.exports = router;