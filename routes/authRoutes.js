const express = require("express");

const router = express.Router();

// requiring user Model to store user data
const User = require("../models/userModel");

// helper to send error response to client
const sendError = require("../helpers/sendErrorResponse");

//module to hash passwords
const bcrypt = require("bcrypt");
//number of rounds to generate a salt
const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return sendError(res, 401, "password and confirmpassword should be same");
  }
  console.log("passowrd and confirm password are same");
  User.findOne({ email })
    .then(user => {
      console.log(user);
      if (user) {
        console.log("user already exists");
        return sendError(res, 401, "The email address already exists");
      }
      console.log(password, saltRounds);
    //   bcrypt.genSalt(saltRounds, function(err, salt) {
    //       console.log(salt);
    //     bcrypt.hash(password, salt, function(error, hash) {
    //       console.log(hash);
    //     });
    //   });
    //   bcrypt.hash(password, saltRounds, function(error, hash) {
    //     console.log(hash);
    //     if (error) {
    //       console.log(error);
    //       return sendError(res, 401, "something");
    //     }
    //     const newUser = new User({
    //       firstName,
    //       lastName,
    //       email,
    //       password: hash
    //     });
    //     newUser
    //       .save()
    //       .then(user => {
    //         console.log("user created");
    //         console.log(user);
    //         return res.json({
    //           status: true,
    //           message: "User created successfully"
    //         });
    //       })
    //       .catch(error => {
    //         console.log(error);
    //         return sendError(res, 401, error);
    //       });
    //   });
      //   bcrypt
      //     .hash(password, saltRounds)
      //     .then(hash => {

      //     })
      //     .catch(error => {

      //     });
    })
    .catch(error => {
      console.log(error);
      return sendError(res, 401, error);
    });
});

router.post("/signin", (req, res, next) => {
  res.send("this is signin route");
});

module.exports = router;
