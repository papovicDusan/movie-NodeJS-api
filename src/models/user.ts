import mongoose, { Schema } from "mongoose";
import { IMovie } from "./movie";
import { IWatchlist } from "./watchlist";

export interface BaseUser {
  email: string;
  password: string;
  name: string;
}

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  likes: string[];
  watchlists: string[];
}

export interface IUserMovieWatchlist extends IUser {
  moviesArray: IMovie[];
  watchlistsArray: IWatchlist[];
}

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

const User = mongoose.model<IUser>("User", userSchema);

export default User;
