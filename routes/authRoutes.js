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
    return sendError(res, 401, "password and confirmpassword should be same");
  }
  User.findOne({ email }) // checking whether email already existed or not
    .then(user => {
      if (user) {
        return sendError(res, 401, "The email address already exists");
      }
      bcrypt.hash(password, saltRounds, function(error, hash) {
        if (error) {
          return sendError(res, 401, "Some Error Occured. Please Try Again After Sometime");
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
              .then(()=>{
                mailer.send.userActivationEmail(user.email,token);
                return res.json({
                  status: true,
                  message: "User created successfully"
                });
              })
          })
          .catch(error => {
            console.log(error);
            return sendError(res, 401, error);
          });
      });
    })
    .catch(error => {
      console.log(error);
      return sendError(res, 401, error);
    });
});

router.post("/signin", (req, res, next) => {
  const {email,password} = req.body;
  User
    .findOne({email:email})
    .then(user=>{
      if(!user)
        return sendError(res, 401, "your email doesn't exist in our recors. please signup.");
      if(user.active === 0)
        return sendError(res, 401, "your account is not activated yet");
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched)
            return sendError(res,401,"your password is wrong");
          return res.send("you can login");
        })
        .catch(error => {
          console.log(error);
          return sendError(res, 401, error);
        })
    })
    .catch(error=>{
      console.log(error);
      return sendError(res, 401, error);
    })
});

router.get("/activate/:token",(req,res,next)=>{
  const token = req.params.token;
  UserActivationToken
    .findOne({token})
    .then( tokenRecord => {
      if(!tokenRecord)
        return sendError(res,401,"something went wrong. please try again after some time");
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
              return sendError(res, 401, error);
            })
        })
        .catch(error => {
          console.log(error);
          return sendError(res, 401, error);
        })
    })
    .catch(error => {
      console.log(error);
      return sendError(res, 401, error);
    })
});

module.exports = router;
