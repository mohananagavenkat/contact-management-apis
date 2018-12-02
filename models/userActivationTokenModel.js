const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userActivationTokenSchema = new Schema({
    _userId:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

const userActivationTokenModel = mongoose.model("useractivationtokens",userActivationTokenSchema);

module.exports = userActivationTokenModel;