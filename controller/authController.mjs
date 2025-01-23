import { promisify } from 'node:util';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/userModel.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';

const { sign, verify } = jsonwebtoken;

const createAndSendToken = (user, statusCode, response) => {
  const token = sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  response.status(statusCode).json({
    status: 'success',
    data: {
      user: user.toAuthJSON(),
      token,
    },
  });
};

export const signup = catchAsync(async (request, response, next) => {
  const { name, email, password, passwordConfirm, role } = request.body;
  let { photo } = request.body;

  if (!photo) photo = `https://i.pravatar.cc/150?u=${email}`;
  const userRole = role || 'user';
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    photo,
    role: userRole,
  });

  createAndSendToken(newUser, 201, response);
});

export const login = catchAsync(async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password)
    return next(new AppError('Please provide email & password!!!', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError('Incorrect Email or Password!!!', 401));

  createAndSendToken(user, 200, response);
});

export const protect = catchAsync(async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    token = request.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError(
        'You are not logged in! Please log in to get access!!!',
        401,
      ),
    );

  const verifiedToken = await promisify(verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(verifiedToken.id);

  if (!user)
    return next(new AppError('This user no longer exists!!!', 401));

  if (user.changedPasswordAfterToken(verifiedToken.iat))
    return next(
      new AppError(
        'User has recently changed password! Please log in again to get access!!!',
        401,
      ),
    );

  request.user = user;

  next();
});

export function restrictTo(...roles) {
  return (request, response, next) => {
    if (!roles.includes(request.user.role))
      return next(
        new AppError(
          'You do not have permission to perform this action!!!',
          403,
        ),
      );
    next();
  };
}

export const updatePassword = catchAsync(async (request, response, next) => {
  const user = await User.findById(request.user.id).select('+password');

  if (!(await user.comparePassword(request.body.oldPassword, user.password)))
    return next(new AppError('Incorrect Password!!!', 401));

  user.password = request.body.newPassword;
  user.passwordConfirm = request.body.passwordConfirm;

  await user.save();

  createAndSendToken(user, 200, response);
});
