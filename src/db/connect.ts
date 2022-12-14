import mongoose from "mongoose";
import config from "../../config";

export const connect = (app: any) => {
  mongoose
    .connect(
      `mongodb+srv://${config.DB_USERNAME}:${config.DB_PASSWORD}@clusternodejs.wid3nbe.mongodb.net/movie?retryWrites=true&w=majority`
    )
    .then((result) => {
      app.listen(8080);
    })
    .catch((err) => console.log(err));
};
