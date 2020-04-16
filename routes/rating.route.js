let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

// Rating Model
let ratingSchema = require('../Model/Rating');

// Add Rating
router.route('/add-rating').post((req, res, next) => {
    ratingSchema.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(data)
            res.json(data)
        }
    })
});

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