const authService = require("../services/auth");

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  const user = await authService.signup(email, name, password);

  res.status(201).json({ message: "User created!", userId: user._id });
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const { access, userId } = await authService.login(email, password);

    res.status(200).json({ access: access, userId: userId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await authService.getUser(userId);

    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
