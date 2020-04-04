const express = require('express')
const app = express();

var port = process.env.PORT || 4000;
app.get('/',(req,res) => res.send('Hellow OWrld'));

app.listen(port, () => console.log('Server is running on port' + port))