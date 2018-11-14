const express = require("express");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    res.send("this is signup route");
});

router.post("/signin", (req, res, next) => {
    res.send("this is signin route");
});

module.exports = router;