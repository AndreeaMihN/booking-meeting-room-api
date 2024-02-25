const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler')

app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//Routes
const officesRouter = require('./routes/offices');
const roomsRouter = require('./routes/rooms');
const usersRouter = require('./routes/users');
const bookingsRouter = require('./routes/bookings');
const teamsRouter = require('./routes/teams');

const api = process.env.API_URL;

app.use(`${api}/rooms`, roomsRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/offices`, officesRouter);
app.use(`${api}/bookings`, bookingsRouter);
app.use(`${api}/teams`, teamsRouter);

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