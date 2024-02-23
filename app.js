const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

//Routes
const roomRouter = require('./routes/room')

const api = process.env.API_URL;

app.use(`${api}/rooms`, roomRouter);

//Database
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=>{
    console.log(err);
})

//Server
app.listen(3000, ()=>{
    console.log('Server is running http://localhost:3000');
})