const express = require('express')
let mongoose = require('mongoose')
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./Database/db');

const productRoute = require('./routes/Products.routes');
const userRoute = require('./routes/user.route');
const wishlistRoute = require('./routes/wishlist.route');
const shoppingCartRoute = require('./routes/shoppingcart.route');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true
}).then(() => {
        console.log('Database sucessfully connected!')
    },
    error => {
        console.log('Could not connect to database : ' + error)
    }
)



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


var port = process.env.PORT || 4000;

app.listen(port, () => console.log('Server is running on port' + port))

// 404 Error
app.use((req, res, next) => {
    next(createError(404));
});

app.get('/',function(req,res) {
    res.send('Hellow Wrold I m lahiru lakshan');
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setheader('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD");
    next();
});
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
//app.listen(port, () => console.log('Server is running on port' + port))