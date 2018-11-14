const express = require("express");

const router = express.Router();

// router.get("/contacts", (req, res, next) => {
//   res.send("this is get route for contacts");
// });

router.post("/contacts", (req, res, next) => {
  res.send("this is post route for contacts");
});

router.get("/contacts/:id", (req, res, next) => {
  res.send("to get specific contact");
});

router.put("/contacts/:id", (req, res, next) => {
  res.send("edit specific contact");
});

router.delete("/contacts/:id", (req, res, next) => {
  res.send("delete specific contact");
});

module.exports = router;
