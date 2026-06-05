import { RequestHandler } from 'express';
import { HydratedDocument } from 'mongoose';
import { asyncHandler } from '../middlewares/asyncHandler';
import { IUser, User } from '../models/User';
import { generateToken } from '../utils/generateToken';

interface RegisterBody {
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

type UserDoc = HydratedDocument<IUser>;

const buildAuthResponse = (user: UserDoc) => ({
  _id: user._id,
  userName: user.userName,
  email: user.email,
  role: user.role,
  token: generateToken(user._id),
});

export const registerUser: RequestHandler<{}, {}, RegisterBody> = asyncHandler(async (req, res) => {
  const { userName, email, password, phoneNumber, address } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ userName, email, password, phoneNumber, address });

  res.status(201).json(buildAuthResponse(user));
});

export const loginUser: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.status(200).json(buildAuthResponse(user));
});
