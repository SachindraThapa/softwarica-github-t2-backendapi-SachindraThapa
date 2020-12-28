var mongoose = require("mongoose");

let pricem = new mongoose.Schema(
  {
    daytype: {
      type: String,
      required: true
    },
    daypart: {
      type: String,
      unique: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Price", pricem);
