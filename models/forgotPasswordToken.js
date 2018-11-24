const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgotPasswordTokenSchema = new Schema({
    _userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const forgotPasswordTokenModel = mongoose.model("forgotpasswordtokens", forgotPasswordTokenSchema);

module.exports = forgotPasswordTokenModel;