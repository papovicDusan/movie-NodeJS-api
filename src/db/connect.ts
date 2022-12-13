import mongoose from "mongoose";
import config from "../../config";
import log from "../logger";

function connect() {
  return mongoose
    .connect(
      `mongodb+srv://${config.DB_USERNAME}:${config.DB_PASSWORD}@clusternodejs.wid3nbe.mongodb.net/movie?retryWrites=true&w=majority`
    )
    .then((result) => {
      log.info("Database connected");
    })
    .catch((err) => {
      log.error("db error", err);
      process.exit(1);
    });
}

export default connect;
