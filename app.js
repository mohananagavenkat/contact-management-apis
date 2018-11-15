const express = require("express");

const app = express();

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

// connecting to mongodb
mongoose
  .connect(
    "mongodb://localhost/contactmanager",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(error => console.error(error));

mongoose.set("useCreateIndex", true); // to get rif of some deprication warning

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// setting access control headers to make CORS possible
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// importing router files
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

// passing routes to middleware
app.use(authRoutes);
app.use(contactRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server started http://localhost:${port}`);
});
