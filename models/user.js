const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique:true,
      required:true
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    phone:{
        type:Number
    },
  },
  {
      discriminatorKey:"role",
      collection:"User",
      // toJSON:{
      //   getters:true,
      //   virtuals:true
      // },
      // toObject:{
      //   getters:true,
      //   virtuals:true
      // }
  }
);

module.exports = mongoose.model("User", userSchema);
