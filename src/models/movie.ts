import mongoose, { Schema } from "mongoose";
import { IComment } from "./comment";

export interface BaseMovie {
  title: string;
  description: string;
  image_url: string;
  genre: string;
}

export interface IMovie extends mongoose.Document {
  title: string;
  description: string;
  image_url: string;
  genre: string;
  commentsId: string[];
  comments: IComment[];
  likes: string[];
  visits: number;
  watchlists: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMovieLikesDislikes extends IMovie {
  numberOfLikes: number;
  numberOfDislikes: number;
}

export interface IMovieLikesDislikesUser extends IMovieLikesDislikes {
  likedOrDislikedUser: number;
}

export interface IMoviePaginate {
  count: number;
  next: number | null;
  previous: number | null;
  results: IMovieLikesDislikes[];
}

export interface IMoviePopular {
  _id: string;
  movie: { title: any }[];
}

export const emptyMoviesPaginate: IMoviePaginate = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    visits: {
      type: Number,
      default: 0,
    },
    watchlists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Watchlist",
      },
    ],
  },
  { timestamps: true }
);

const Movie = mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;
