const express = require("express");

const router = express.Router();

// requiring user Model to store user data
const User = require("../models/userModel");
// requiring UserActivationToken Model to store activation token of user in database
const UserActivationToken = require("../models/userActivationTokenModule");

// helper to send error response to client
const sendError = require("../helpers/sendErrorResponse");

//module to hash passwords
const bcrypt = require("bcryptjs");
//number of rounds to generate a salt
const saltRounds = 10;
// requiring builtin crypto module to generate random token for user activation
const crypto = require("crypto");

const mailer = require("../helpers/mailer");

router.post("/signup", (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return sendError(res, 200, "password and confirmpassword should be same");
  }
  User.findOne({ email }) // checking whether email already existed or not
    .then(user => {
      if (user) {
        return sendError(res, 200, "The email address already exists");
      }
      bcrypt.hash(password, saltRounds, function(error, hash) {
        if (error) {
          return sendError(res, 200, "Some Error Occured. Please Try Again After Sometime");
        }
        const newUser = new User({
          firstName,
          lastName,
          email,
          password: hash
        });
        newUser
          .save()
          .then(user => {
            const token = crypto.randomBytes(64).toString("hex");
            const newUserActivationToken = new UserActivationToken({
              _userId:user.id,
              token
            });
            newUserActivationToken
              .save()
              .then((tokenRecord)=>{
                mailer.send.userActivationEmail(user.email, token);
                return res.json({
                  status: true,
                  message: "User created successfully",
                  tokenId: tokenRecord.id
                });
              })
          })
          .catch(error => {
            console.log(error);
            return sendError(res, 200, error);
          });
      });
    })
    .catch(error => {
      console.log(error);
      return sendError(res, 200, error);
    });
});

router.post("/signin", (req, res, next) => {
  const {email,password} = req.body;
  User
    .findOne({email:email})
    .then(user=>{
      if(!user)
        return sendError(res, 200, "your email doesn't exist in our recors. please signup.");
      if(user.active === 0){
        UserActivationToken
          .findOne({_userId:user.id})
          .then(
            (tokenRecord)=>{
              return sendError(res, 200, "your account is not activated yet",{tokenId:tokenRecord.id});
            }
          )
          .catch(error => {
            console.log(error);
            return sendError(res, 200, error);
          })
      }else{
        bcrypt
          .compare(password, user.password)
          .then((matched) => {
            if (!matched)
              return sendError(res, 200, "your password is wrong");
            return res.send("you can login");
          })
          .catch(error => {
            console.log(error);
            return sendError(res, 200, error);
          })
      }
    })
    .catch(error=>{
      console.log(error);
      return sendError(res, 200, error);
    })
});

router.get("/activate/:token",(req,res,next)=>{
  const token = req.params.token;
  UserActivationToken
    .findOne({token})
    .then( tokenRecord => {
      if(!tokenRecord)
        return sendError(res,200,"something went wrong. please try again after some time");
      User
        .findByIdAndUpdate(
          tokenRecord._userId,
          {
            active:1
          }
        )
        .then(()=>{
          UserActivationToken
            .findByIdAndDelete(tokenRecord.id)
            .then(()=>{
              return res.json({
                status: true,
                message: "account activated successfully"
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

router.get("/resend/activationtoken/:tokenId",(req,res,next)=>{
  const tokenId = req.params.tokenId;
  UserActivationToken
    .findById(tokenId)
    .then(
      (tokenRecord)=>{
        const {token,_userId} = tokenRecord;
        console.log(token,_userId);
        User
          .findById(_userId)
          .then(
            (userRecord)=>{
              const email = userRecord.email;
              mailer.send.userActivationEmail(email, token);
              return res.json({
                status:true,
                message:"We have resent activation email. Please check in your spam folder also."
              })
            }
          )
        return;
      }
    )
})

module.exports = router;
