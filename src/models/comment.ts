import mongoose, { Schema } from "mongoose";

export interface BaseComment {
  content: string;
  movie: string;
}

export interface IComment extends mongoose.Document {
  content: string;
  movie: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentPaginate {
  count: number;
  next: number | null;
  previous: number | null;
  results: IComment[];
}

export const emptyCommentPaginate: ICommentPaginate = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
