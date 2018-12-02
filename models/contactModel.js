const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstName:String,
    lastName:String,
    email:String,
    phoneNumber:String,
    avatar:String,
    job:String,
    company:String,
    avatar:String
});

module.exports = mongoose.model("contacts",contactSchema);