const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transSchema = new Schema({
  essential:{
      type: String,
  },
  amount: {
      type: Number
  },
  where: {
      type: String
  },
  what: {
      type: String
  },
  when: {
      type: Date
  },
});

const Trans = mongoose.model("Transaction", transSchema);

module.exports = Trans;
