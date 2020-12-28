var mongoose = require("mongoose");

let pbookSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    username: {
      type: mongoose.Schema.Types.String,
      ref: 'User',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    delivered: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookProduct", pbookSchema);
