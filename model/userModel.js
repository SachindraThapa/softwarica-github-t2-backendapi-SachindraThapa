var mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

let userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      primaryKey: true
    },
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength:6
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength:6
    },
    profile_image:{
      type: String,
      default: "user.png"
    },
    user_type: {
      type: String,
      default: "user"
    }
},
{ timestamps: true }
);
userSchema.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = mongoose.model("User", userSchema);