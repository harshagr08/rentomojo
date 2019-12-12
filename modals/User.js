const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userschema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resettoken: {
    type: String
  },
 firstname:{
    type:String,
    required:true
  },
  middlename:{
    type:String
  },
  lastname:{
    type:String,
    required:true
  }
});
module.exports = mongoose.model("users", userschema);
