const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movie");
const commentRoutes = require("./routes/comment");
const likeRoutes = require("./routes/like");
const watchlistRoutes = require("./routes/watchlist");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRoutes);
app.use("/movies", commentRoutes);
app.use("/movies", movieRoutes);
app.use("/movies", likeRoutes);
app.use("/watchlists", watchlistRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@clusternodejs.wid3nbe.mongodb.net/movie?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));

module.exports = app;
