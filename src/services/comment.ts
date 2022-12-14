import Comment, {
  IComment,
  BaseComment,
  ICommentPaginate,
  emptyCommentPaginate,
} from "../models/comment";
import Movie, { IMovie } from "../models/movie";
import { AppError } from "../utils/app-error";

const createComment = async (dataComment: BaseComment): Promise<IComment> => {
  const commentNew: IComment = new Comment({
    content: dataComment.content,
    movie: dataComment.movie,
  });
  const comment: IComment = await commentNew.save();

  const movie: IMovie | null = await Movie.findById(dataComment.movie);
  if (!movie) {
    const error: AppError = new AppError("Could not find movie.", 404);
    throw error;
  }
  movie.comments.push(comment._id);
  await movie.save();

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
    const error: AppError = new AppError("Could not find movie.", 404);
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
