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
router.route('/add-product').post(upload.array('ImageOfProduct',5),(req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    console.log(url)
   //console.log(req.body.ColorOfImg[0])
    const product = new ProductSchema({
        _id: new mongoose.Types.ObjectId(),
        ProductName: req.body.ProductName,
        ProductBrand: req.body.ProductBrand,
        Category: req.body.Category,
        PricePerUnit: req.body.PricePerUnit,
        SubCategory: req.body.SubCategory,
        StockAmount: req.body.StockAmount,
        ColorOfImg:  req.body.ColorOfImg

    });

    for(var i=0;i<req.files.length;i++) {
        product.ImageOfProduct[i] = url + '/public/' + req.files[i].filename
        product.ColorOfImg[i] = req.body.ColorOfImg[i]
        product.StockSmall[i] = req.body.StockSmall[i]
        product.StockMedium[i] = req.body.StockMedium[i]
        product.StockLarge[i] = req.body.StockLarge[i]
        product.StockXL[i] = req.body.StockXL[i]
    }
    var datetime = new Date();
    product.AddDate = datetime.toISOString().slice(0,10)
//coomt


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
    ProductSchema.find({}).sort({AddDate:'desc'}).exec((error,data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

// Get Single Product
router.route('/view-product/:id').get((req, res) => {
    ProductSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return (error)
        } else {
            res.json(data)
        }
    })
})

router.route('/get-products/:id').get((req,res) => {
    var Query = {SubCategory : req.params.id}
    ProductSchema.find(Query, (error,data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

// search function


router.route('/search/:id').get((req,res) => {
   ProductSchema.find({$text: {$search: req.params.id}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).exec((error,data) => {
       if (error) {
           return next(error)
       } else {
           res.json(data)
       }
   })

});


module.exports = router;