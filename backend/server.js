//use: npm start server.js -> to run the server

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
//mongoose to connect to mongodb

require('dotenv').config();
//environment variable in .env

const app = express();

app.use(cors());
app.use(express.json());
//so we can parse json

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
//start connection
//added whitelist

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connected!")
})
//connection started

//add routes here
const TransRouter = require('./routes/trans');
app.use('/transactions', TransRouter);
//if anyone goes to /trans its gonna load everything in transaction router

app.listen(5000, () => {
    console.log(`server is running on port: 5000`);
})