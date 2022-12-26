import { IComment, BaseComment, ICommentPaginate } from "../models/comment";
import { IMovie } from "../models/movie";
import { AppError } from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import { validateCommentData } from "../utils/validations";
import commentRepo from "../repositories/comment";
import movieRepo from "../repositories/movie";

const createComment = async (dataComment: BaseComment): Promise<IComment> => {
  const valid = validateCommentData(dataComment);
  if (valid.error) {
    const error: AppError = new AppError(
      valid.error.message,
      StatusCodes.BAD_REQUEST
    );
    throw error;
  }

  const comment: IComment = await commentRepo.createComment(dataComment);

  const movie: IMovie | null = await movieRepo.findMovieAndUpdateComments(
    dataComment.movie,
    comment._id
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
  page: number,
  limit: number
): Promise<ICommentPaginate> => {
  const comments: any = await commentRepo.getComments(movieId, page, limit);

  return comments;
};

export default { createComment, getComments };
