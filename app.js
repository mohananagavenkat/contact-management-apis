const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use(authRoutes);
app.use(contactRoutes);

app.get("/", (req, res, next) => {
  res.send("This is sample route");
});

app.get("/contacts", (req, res, next) => {
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

app.listen(port, () => {
  console.log(`server started http://localhost:${port}`);
});
