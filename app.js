const express = require('express')
let mongoose = require('mongoose')
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./Database/db');

const productRoute = require('./routes/Products.routes')

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

app.use((req, res, next) => {
    next(createError(404));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use('/public', express.static('public'));
app.use('/products', productRoute)




var port = process.env.PORT || 4000;

app.get('/',(req,res) =>
    res.send('Hellow Wrold I m lahiru lakshan')
);
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
app.listen(port, () => console.log('Server is running on port' + port))