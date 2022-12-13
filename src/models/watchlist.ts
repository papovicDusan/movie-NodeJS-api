import mongoose, { Schema } from "mongoose";

export interface BaseWatchlist {
  movie: string;
  user: string;
}

export interface IWatchlist extends mongoose.Document {
  is_watched: boolean;
  movie: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

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

const Watchlist = mongoose.model<IWatchlist>("Watchlist", watchlistSchema);

export default Watchlist;
