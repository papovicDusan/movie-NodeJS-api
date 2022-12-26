import Like, { ILike, BaseLike } from "../models/like";

const createLike = async (dataLike: BaseLike): Promise<ILike> => {
  const like: ILike = new Like({
    like: dataLike.like,
    movie: dataLike.movie,
    user: dataLike.user,
  });
  return await like.save();
};

const findLike = async (
  movieId: string,
  userId: string
): Promise<ILike | null> => {
  return await Like.findOne({
    user: userId,
    movie: movieId,
  });
};

const deleteLike = async (likeId: string): Promise<any> => {
  return await Like.deleteOne({ _id: likeId });
};

export default {
  createLike,
  findLike,
  deleteLike,
};
