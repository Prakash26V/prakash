if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const apiRoute = require('./api');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const cors= require('cors')
// for Image URL
const path = require('path')
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

// mongosse conectivity
mongoose.connect('mongodb://localhost:27017/Prakash',
    // {useNewUrlParser: true, useNewfiedTopology: true},
    (err) => {
        if (!err) console.log('db connected');
        else console.log('not connected')
    })
// middleware
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
});

app.use(express.json());
//app.use(express.urlencoded());
app.use(apiRoute);

app.listen(3000, () => {
    console.log('connected on 3000 port')
})  