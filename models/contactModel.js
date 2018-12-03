const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    _userId:String,
    firstName:String,
    lastName:String,
    email:String,
    phoneNumber:String,
    job:String,
    company:String,
    avatar:String,
    notes:String,
    createdAt:{ type:Date, default:Date.now },
    updatedAt:{ type:Date, default:Date.now }
});

module.exports = mongoose.model("contacts",contactSchema);