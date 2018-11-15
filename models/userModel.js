const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:string,
        required:true
    },
    lastName:{
        type: string,
        required: true
    },
    email:{
        type: string,
        required: true,
        unique:true
    },
    password:{
        type: string,
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;