const router = require('express').Router();
let categoryRoute = require('../Model/CAT.model');

//get all the product managers
router.route('/all').get((req,res)=>{
    categoryRoute.find()
        .then(cats=>res.json(cats))
        .catch(err=>res.status(400).json('Error: '+err));
});

//get product managers by ID
router.route('/:id').get((req,res)=>{
    categoryRoute.findById(req.params.id).exec().then(user=>{
        res.json(user || {});
    }).catch(err=>{
        console.log(err);
        res.sendStatus(500);
    });
});

//adding categoryRoute managers
router.route('/add').post((req,res)=>{
    const name = req.body.name;
    const slug = req.body.slug;
    const description = req.body.description;
    const subCategory = req.body.subCategory;
    const newCategory = new categoryRoute({name,slug,description,subCategory});

    newCategory.save().then(()=> res.sendStatus(200)).catch(err => res.sendStatus(400).json('Error'+ err));
});

//Deleting product managers
router.route('/:id').delete((req,res)=>{
    categoryRoute.findOneAndRemove({name:req.params.id}).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.sendStatus(500);
    });
});

//Updating product managers
router.route('/:id').put((req,res)=>{
    categoryRoute.findOneAndUpdate({name:req.params.id},{$set: req.body},{new:true}).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
});

module.exports = router
