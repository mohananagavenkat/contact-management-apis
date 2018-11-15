const express = require("express");

const router = express.Router();

router.get("/contacts", (req, res, next) => {
  res.json([
    {
      firstName: "Mohana Naga Venkat",
      lastName: "Sayempu",
      phoneNumber: "9949270864",
      email: "mohananagavenkat@gmail.com",
      company: "Smactechlabs",
      job: "web developer",
      notes: "nothing",
      avatar: "/assets/img/profilepic.jpg"
    },
    {
      firstName: "Hemasri Sravya",
      lastName: "Sayempu",
      phoneNumber: "9631457822",
      email: "sravya@gmail.com"
    },
    {
      firstName: "Ratnamala",
      lastName: "Nallapaneni",
      phoneNumber: "9908439725",
      email: "ratnamala.nallapaneni@gmail.com"
    },
    {
      firstName: "Sivaram prasad",
      lastName: "Sayempu",
      phoneNumber: "9603531248",
      email: "sivaramprasad553@gmail.com"
    },
    {
      firstName: "Ammamma",
      phoneNumber: "9177326204"
    },
    {
      firstName: "Bava",
      phoneNumber: "9989992566",
      email: "bharathkumar.pamulapati@gmail.com"
    }
  ]);
});

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
