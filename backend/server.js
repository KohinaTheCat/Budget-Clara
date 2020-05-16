const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
//so we can parse json

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connected!")
})

//add routes here
const MainRouter = require('./routes/main');
app.use('/main', MainRouter);

app.listen(5000, () => {
    console.log(`server is running on port: 5000`);
})