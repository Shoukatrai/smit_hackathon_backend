import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique : true 
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String
  },
  gender: {
    type: String
  },
  type: {
    type: String,
    enum : ["admin" , "customer" , "vendor"]
  },
  createdAt :{
    type : Date,
    default : Date.now()
  }
});


export const userModel = mongoose.model("user" , userSchema)