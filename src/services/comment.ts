import Comment, {
  IComment,
  BaseComment,
  ICommentPaginate,
  emptyCommentPaginate,
} from "../models/comment";
import Movie, { IMovie } from "../models/movie";
import { AppError } from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import { validateCommentData } from "../utils/validations";

const createComment = async (dataComment: BaseComment): Promise<IComment> => {
  const valid = validateCommentData(dataComment);
  if (valid.error) {
    const error: AppError = new AppError(
      valid.error.message,
      StatusCodes.BAD_REQUEST
    );
    throw error;
  }

  const commentNew: IComment = new Comment({
    content: dataComment.content,
    movie: dataComment.movie,
  });
  const comment: IComment = await commentNew.save();

  const movie: IMovie | null = await Movie.findOneAndUpdate(
    { _id: dataComment.movie },
    { $push: { comments: comment._id } },
    { new: true }
  );

  if (!movie) {
    const error: AppError = new AppError(
      "Could not find movie.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  return comment;
};

const getComments = async (
  movieId: string,
  page: any,
  limit: number
): Promise<ICommentPaginate> => {
  const commentPaginate: ICommentPaginate = emptyCommentPaginate;
  const startIndex: number = (page - 1) * limit;
  const endIndex: number = page * limit;

  const movie: IMovie | null = await Movie.findById(movieId).populate(
    "comments"
  );

  if (!movie) {
    const error: AppError = new AppError(
      "Could not find movie.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  commentPaginate.count = movie.comments.length;

  endIndex < movie.comments.length
    ? (commentPaginate.next = page + 1)
    : (commentPaginate.next = null);
  startIndex > 0
    ? (commentPaginate.previous = page - 1)
    : (commentPaginate.previous = null);

  commentPaginate.results = movie.comments.slice(
    startIndex,
    startIndex + limit
  );
  return commentPaginate;
};

export default { createComment, getComments };
