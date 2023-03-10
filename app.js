//This app.js is for handling requests 

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes =  require('./api/routes/products');
const orderRoutes =  require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

const MONGODB_URI = "mongodb+srv://node-rest-shop:"+process.env.MONGO_ATLAS_PW+"@atlascluster.vt46k1m.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error(error));

mongoose.Promise = global.Promise;

mongoose.set('strictQuery', false);
//this just let us to show the request status and time in the terminal
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));//let us extract urlencoded bodies
app.use(bodyParser.json());//let us extract json bodies
app.use((req,res,next)=>{ //this is to avoid CORS Errors (while testing it doesn't happen since we are on the same server it only happens on diff one)
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    
    if(req.method === "OPTIONS")
    {
        res.header("Acess-Control-Allow-Methods","PUT,POST,PATCH,DELETE");
        return res.status(200).json({});
    }
    next();
});
//Routes which should handle requests 
app.use('/orders',orderRoutes); //handling request for orders
app.use('/products',productRoutes); //handling request for products
app.use('/user',userRoutes); //handling request for signup

//it will reach this line if none of the above requests are sent 
app.use((req,res,next)=>{
    const error = new Error('Page Not found');
    error.status = 404;
    next(error);

});

app.use((error, req, res, next)=>{ // if any other error occured in the app this will be executed
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
