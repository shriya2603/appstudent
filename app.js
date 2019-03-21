const express       = require('express');
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const app = express();

//
mongoose.connect('mongodb://127.0.0.1:27017/apiAuth', { useNewUrlParser: true });
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;


//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());



//routes
app.use('/users',require('./routes/users'));




//server
const port = process.env.PORT || 3000;
app.listen(port);
console.log('server listens at '+port);