const express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./Database/db');


const productRoute = require('./routes/Products.routes');
const userRoute = require('./routes/user.route');
const wishlistRoute = require('./routes/wishlist.route');
const shoppingCartRoute = require('./routes/shoppingcart.route');
const billingRoute = require('./routes/billing.route');
const creditcardRoute = require('./routes/creditcard.route');
const ratingRoute = require('./routes/rating.route');
const AdminRouter = require('./routes/Admin.route');
const CategoryRouter = require('./routes/Category.route');
const AdminUserRouter = require('./routes/Admin_User.route');




const app = express();

const db = require("./Model");
const Role = db.role;

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
        console.log('Database sucessfully connected!');
        initial();
    },
    error => {
        console.log('Could not connect to database : ' + error)
    }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(cors());
app.options('*', cors());
app.use('/public', express.static('public'));
app.use('/products', productRoute);
app.use('/users', userRoute);
app.use('/wishlist', wishlistRoute);
app.use('/shoppingcart', shoppingCartRoute);
app.use('/billing',billingRoute);
app.use('/credit-card',creditcardRoute);
app.use('/rating',ratingRoute);
app.use('/admin',AdminRouter);
app.use('/category',CategoryRouter);
app.use('/userAdmin',AdminUserRouter);


var port = process.env.PORT || 4000;

app.listen(port, () => console.log('Server is running on port' + port))

// 404 Error
app.use((req, res, next) => {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}