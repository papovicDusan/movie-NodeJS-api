import Comment, {
  IComment,
  BaseComment,
  ICommentPaginate,
} from "../models/comment";

const createComment = async (dataComment: BaseComment): Promise<IComment> => {
  const comment: IComment = new Comment({
    content: dataComment.content,
    movie: dataComment.movie,
  });
  return await comment.save();
};

const getComments = async (
  movieId: string,
  page: number,
  limit: number
): Promise<ICommentPaginate> => {
  const comments: any = await Comment.paginate(
    { movie: movieId },
    { page: page, limit: limit }
  );

  return comments;
};

export default { createComment, getComments };
