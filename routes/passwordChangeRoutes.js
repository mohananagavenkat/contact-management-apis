const express = require("express");

const router = express.Router();

// requiring user Model to store user data
const User = require("../models/userModel");

const forgotPasswordToken = require("../models/forgotPasswordToken");

// helper to send error response to client
const sendError = require("../helpers/sendErrorResponse");

// requiring builtin crypto module to generate random token for user activation
const crypto = require("crypto");

//module to hash passwords
const bcrypt = require("bcryptjs");
//number of rounds to generate a salt
const saltRounds = 10;

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

router.post("/forgotpassword/validatetoken", (req, res, next) => {
    const token = req.body.token;
    forgotPasswordToken
        .findOne({ token })
        .then(tokenRecord => {
            if (!tokenRecord){
                return sendError(res, 200, "something went wrong.Your token is invalid or you already changed your password using this token. For further assistance contact our support team");
            }
            // console.log(  );
            // return;
            else if ( ( (new Date()).getTime() - (tokenRecord.createdAt).getTime() ) / 1000 > 3600 ){
                return sendError(res, 200, "Token was expired",{tokenExpired:true});
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

router.post("/resetpassword",(req,res,next)=>{
    const { password, confirmPassword , id } = req.body;
    if (password !== confirmPassword) {
        return sendError(res, 200, "password and confirmpassword should be same");
    }
    User
        .findById(id)
        .then(userRecord => {
            if(!userRecord){
                return sendError(res, 200, "Something went wrong");
            }
            bcrypt.hash(password, saltRounds, function (error, hash) {
                if (error) {
                    return sendError(res, 200, "Some Error Occured. Please Try Again After Sometime");
                }
                userRecord.password = hash;
                userRecord
                    .save()
                    .then(()=>{
                        return res.json({
                            status:true,
                            message:"password changed successfully"
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        return sendError(res, 200, error);
                    })
            })
        }).catch(error => {
            console.log(error);
            return sendError(res, 200, error);
        })
});

module.exports = router;