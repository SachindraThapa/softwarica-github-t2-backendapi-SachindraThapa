var mongoose = require("mongoose");

let gbookSchema = new mongoose.Schema(
  {
    date_and_time: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: mongoose.Schema.Types.String,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookGround", gbookSchema);
