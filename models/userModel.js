const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },
    active:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;