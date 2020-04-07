let mongoose = require('mongoose')
express = require('express')
multer = require('multer')
uuidv4 = require('uuid/v4'),
router = express.Router();


const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

let ProductSchema = require('../Model/Products');

//Create Product
router.route('/add-product').post(upload.single('ImageOfProduct'),(req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    console.log(url)
    const product = new ProductSchema({
        _id: new mongoose.Types.ObjectId(),
        ProductName: req.body.ProductName,
        Category: req.body.Category,
        PricePerUnit: req.body.PricePerUnit,
        SubCategory: req.body.SubCategory,
      ImageOfProduct: url + '/public/' + req.file.filename,
        StockAmount: req.body.StockAmount
    });
    product.save().then(result => {
        res.status(201).json({
            message: "User registered successfully!",
            userCreated: {
                _id: result._id,
                ImageOfProduct: result.ImageOfProduct
            }

        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })

});

// READ Products
router.route('/').get((req, res) => {
    ProductSchema.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

// Get Single Student
router.route('/view-product/:id').get((req, res) => {
    ProductSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

module.exports = router;