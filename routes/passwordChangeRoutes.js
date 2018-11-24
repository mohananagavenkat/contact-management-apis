const express = require("express");

const router = express.Router();

// requiring user Model to store user data
const User = require("../models/userModel");

const forgotPasswordToken = require("../models/forgotPasswordToken");

// helper to send error response to client
const sendError = require("../helpers/sendErrorResponse");

// requiring builtin crypto module to generate random token for user activation
const crypto = require("crypto");

const mailer = require("../helpers/mailer");

router.post("/forgotpassword", (req, res, next) => {
    const email = req.body.email;
    User
        .findOne({ email })
        .then(userRecord => {
            if (!userRecord) {
                return sendError(res, 200, "Email address doen't exist.");
            }
            forgotPasswordToken
                .findOneAndDelete({ _userId: userRecord.id })
                .then(() => {

                    const token = crypto.randomBytes(64).toString("hex");
                    const newForgotPasswordToken = new forgotPasswordToken({
                        _userId: userRecord.id,
                        token
                    });
                    newForgotPasswordToken
                        .save()
                        .then(tokenRecord => {
                            mailer.send.forgotPasswordEmail(userRecord.email, token);
                            return res.json({
                                status: true,
                                message: "A link has been sent to your email",
                                tokenId: tokenRecord.id
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            return sendError(res, 200, error);
                        })
                })
                .catch(error => {
                    console.log(error);
                    return sendError(res, 200, error);
                })
        })
        .catch(error => {
            console.log(error);
            return sendError(res, 200, error);
        })
});

router.get("/resetpassword/:token", (req, res, next) => {
    const token = req.params.token;
    forgotPasswordToken
        .findOneAndDelete({ token })
        .then(tokenRecord => {
            if (!tokenRecord){
                return sendError(res, 200, "something went wrong.May be your account is already activated or else please try again after some time. For further assistance contact our support team");
            }
            return res.json({
                status:true,
                message:"token verified successfully",
                id:tokenRecord._userId
            });
        })
        .catch(error => {
            console.log(error);
            return sendError(res, 200, error);
        })
});

router.get("/resend/forgotpasswordtoken/:tokenId", (req, res, next) => {
    const tokenId = req.params.tokenId;
    forgotPasswordToken
        .findById(tokenId)
        .then(
            (tokenRecord) => {
                if (!tokenRecord)
                    return sendError(res, 200, "something went wrong.May be you had already reset password using this link. For further assistance contact our support team");
                const { token, _userId } = tokenRecord;
                console.log(token, _userId);
                User
                    .findById(_userId)
                    .then(
                        (userRecord) => {
                            const email = userRecord.email;
                            mailer.send.userActivationEmail(email, token);
                            return res.json({
                                status: true,
                                message: "We have resent email with password reset link. Please check in your spam folder also."
                            })
                        }
                    )
                return;
            }
        )
})

module.exports = router;