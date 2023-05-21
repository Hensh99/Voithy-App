const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if the email and password exists!
  if (!email || !password) {
    return next(
      new AppError("Please provide the E-mail and the password!", 400)
    );
  }
  // check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid E-mail or Password", 401));
  }
  // if valid, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Please login to get access.", 401));
  }

  // 2) Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if the user is still exists
  const validUser = await User.findById(decoded.id);
  if (!validUser) {
    return next(new AppError("This user is no longer exists", 401));
  }

  // 4) Check if the user has changed his password after the token issued
  if (validUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "This user changed his password recently.. try login again!",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = validUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles = [admin, development]. role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError("permission denied", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted E-mail
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("This E-mail doesn't exists.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user`s E-mail
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `forgot your password? submit a patch request with your new password and passwordConfirm to: ${resetURL}. If you didn't forget your password, please ignore this E-mail!`;

  try {
    await sendEmail({
      email: user.email,
      subject: `your password reset token (valid for 10 min)`,
      message,
    });

    res.status(200).json({
      status: "Success",
      message: "Token was sent to E-mail",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("An Error has ocurred, Please try again later"),
      500
    );
  }
});

exports.resetPassword = (req, res, next) => {};
