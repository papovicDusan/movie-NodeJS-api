import { IComment, BaseComment, ICommentPaginate } from "../models/comment";
import { IMovie } from "../models/movie";
import { NotFoundError, BadRequestError } from "../utils/app-error";
import { validateCommentData } from "../utils/validations";
import commentRepo from "../repositories/comment";
import movieRepo from "../repositories/movie";

const createComment = async (dataComment: BaseComment): Promise<IComment> => {
  const comment: IComment = await commentRepo.createComment(dataComment);

  const movie: IMovie | null = await movieRepo.findMovieAndUpdateComments(
    dataComment.movie,
    comment._id
  );

  if (!movie) {
    const error: NotFoundError = new NotFoundError("Could not find movie.");
    throw error;
  }

  return comment;
};

const getComments = async (
  movieId: string,
  page: number,
  limit: number
): Promise<ICommentPaginate> => {
  const comments: any = await commentRepo.getComments(movieId, page, limit);

  return comments;
};

export default { createComment, getComments };
