const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const watchlistSchema = new Schema(
  {
    is_watched: {
      type: Boolean,
      default: false,
    },
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("watchlist", watchlistSchema);
