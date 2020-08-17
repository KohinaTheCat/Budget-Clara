/*
schema for user. to be used.
*/

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mainSchema = new Schema({
    name: {
        type: String,
    }
})

const Main = mongoose.model('Main', mainSchema);

module.exports = Main;