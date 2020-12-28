var mongoose = require("mongoose");

let ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      unique: true
    },
    slug: {
      type: String,
      unique: [true,"The slug must be unique."]
    },
    brand: {
      type: String,
      required: [true,"Product brand is required."]
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    price: {
      type: Number,
      required: [true, "Price is required."]
    },
    description: {
      type: String
    },
    discount: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4,
      max: 5
    },
    stock: {
      type: Boolean,
      default: false
    },
    image: {
      type: String
    },
  },
  { timestamps: true }
);

const product = mongoose.model("Product", ProductSchema);

module.exports = product;
