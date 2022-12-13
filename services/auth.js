const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const mongoose = require("mongoose");

exports.signup = async (email, name, password) => {
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    const error = new Error("A user with this email exist.");
    error.statusCode = 400;
    throw error;
  }

  const hashedPw = await bcrypt.hash(password, 12);

  const userNew = new User({
    email: email,
    password: hashedPw,
    name: name,
  });
  const user = await userNew.save();

  return user;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new Error("A user with this email could not be found.");
    error.statusCode = 400;
    throw error;
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error = new Error("Wrong password!");
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign(
    {
      // email: user.email,
      userId: user._id.toString(),
    },
    config.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { access: token, userId: user._id.toString() };
};

exports.getUser = async (userId) => {
  const userArray = await User.aggregate([
    {
      $lookup: {
        from: "watchlists",
        localField: "watchlists",
        foreignField: "_id",
        as: "watchlistsArray",
      },
    },
    {
      $lookup: {
        from: "movies",
        localField: "watchlistsArray.movie",
        foreignField: "_id",
        as: "moviesArray",
      },
    },

    {
      $match: {
        _id: mongoose.Types.ObjectId(userId),
      },
    },
  ]);
  const user = userArray[0];

  return user;
};
