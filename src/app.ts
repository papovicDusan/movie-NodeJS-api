import express from "express";
import config from "../config";
import log from "./logger";
import connect from "./db/connect";

import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth";
import movieRoutes from "./routes/movie";
import likeRoutes from "./routes/like";
import commentRoutes from "./routes/comment";
import watchlistRoutes from "./routes/watchlist";

import "dotenv/config";

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

app.use("/", authRoutes);
app.use("/movies", commentRoutes);
app.use("/movies", movieRoutes);
app.use("/movies", likeRoutes);
app.use("/watchlists", watchlistRoutes);

// app.use((error, req, res, next) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({ message: message, data: data });
// });

mongoose
  .connect(
    `mongodb+srv://${config.DB_USERNAME}:${config.DB_PASSWORD}@clusternodejs.wid3nbe.mongodb.net/movie?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));

export default app;
