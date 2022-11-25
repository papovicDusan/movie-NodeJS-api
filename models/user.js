const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  watchlists: [
    {
      type: Schema.Types.ObjectId,
      ref: "Watchlist",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
