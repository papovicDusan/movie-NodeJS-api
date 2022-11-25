const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
var mongoose = require("mongoose");

exports.signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
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

    res.status(201).json({ message: "User created!", userId: user._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
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
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ access: token, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
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
          _id: mongoose.Types.ObjectId(req.userId),
        },
      },
    ]);
    const user = userArray[0];

    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
