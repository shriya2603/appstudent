const express       = require('express');
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');

const ejs 			= require('ejs');
const path			= require('path');
const app = express();

//
mongoose.connect('mongodb://127.0.0.1:27017/apiAuth', { useNewUrlParser: true });
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });


app.use((req, res, next) => {
    console.log("Middleware!")
    next()
})

//middleware
// app.use(morgan('dev'));

app.use(bodyParser.json());

// app.use((req, res, next) => {
//     console.log("Middleware!")
//     next()
// })

//view 
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.static('./uploads'));

//routes
app.use('/users',require('./routes/users'));




//server
const port = process.env.PORT || 4000;
app.listen(port);
console.log('server listens at '+port);