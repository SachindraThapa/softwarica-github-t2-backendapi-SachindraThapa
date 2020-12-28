var mongoose = require("mongoose");

let categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true 
    },
    contents: {
      type: String
    },
    image: {
      type: String
    },
  },
  { timestamps: true }
);

const category = mongoose.model("Category", categorySchema);

module.exports = category;