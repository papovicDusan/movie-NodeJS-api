import mongoose, { Schema } from "mongoose";

export interface BaseLike {
  like: number;
  movie: string;
  user: string;
}

export interface ILike extends mongoose.Document {
  like: number;
  movie: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema(
  {
    like: {
      type: Number,
      required: true,
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

const Like = mongoose.model<ILike>("Like", likeSchema);

export default Like;
