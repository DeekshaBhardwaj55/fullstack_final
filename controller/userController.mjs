import User from '../models/userModel.mjs';
import catchAsync from '../utils/catchAsync.mjs';
import AppError from '../utils/appError.mjs';
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  getDistinctValueAndCount,
} from '../utils/handlerFactory.mjs';

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User); // Do not update Password with this
export const deleteUser = deleteOne(User);

export function getMe(request, response, next) {
  request.params.id = request.user.id;
  next();
}

export const getRoleAndCount = getDistinctValueAndCount(User, 'role');

export const updateMe = catchAsync(async (request, response, next) => {
  const allowedFields = ['name', 'email', 'photo'];

  // 1 Create error if user POSTs unwanted fields names that are not allowed to be updated
  for (const element of Object.keys(request.body)) {
    if (!allowedFields.includes(element)) {
      return next(
        new AppError(
          `This route is used just for updating ${allowedFields}!!! Please try again!!!`,
          400,
        ),
      );
    }
  }

  // 2 Update User data
  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    request.body, // filteredReqBody,
    {
      new: true, // true to return the modified document rather than the original.
      runValidators: true, // runs update validators on this command.
    },
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  response.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (request, response, next) => {
  const updatedUser = await User.findByIdAndUpdate(request.user.id, { active: false });

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  response.status(200).json({
    status: 'success',
  });
});
