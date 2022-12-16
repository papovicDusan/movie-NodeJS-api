import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

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
  docs: IComment[];
  nextPage: number | null;
  prevPage: number | null;
  totalDocs: number;
}

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

commentSchema.plugin(paginate);
const Comment = mongoose.model<IComment, mongoose.PaginateModel<IComment>>(
  "Comment",
  commentSchema
);

export default Comment;
