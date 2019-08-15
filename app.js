"use strict"
require('dotenv').config();
const express = require("express");
const app = express();
const server= require('http').createServer(app);
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors');
const io = require('socket.io')(server);

const routing = require('./routing/routing');
const productService = require('./services/productService');
productService.setIo(io);



const port = process.env.PORT || 3000;

//App Setup
app.use(cors());
// app.use(morgan('combined'));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/api',routing);


server.listen(port,()=>{
    console.log(`Application server started on port ${port}`)
})



io.on('connection',(socket)=>{
    console.log('a user connected');

       //Send a message after a timeout of 4seconds
       setInterval(
         ()=>{
           return productService.getProductBiddingListForSocketService();
         },
         10000
      );

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
})

