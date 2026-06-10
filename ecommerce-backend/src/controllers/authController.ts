import { RequestHandler } from 'express';
import { HydratedDocument } from 'mongoose';
import { asyncHandler } from '../middlewares/asyncHandler';
import { IUser, User } from '../models/User';
import { generateToken } from '../utils/generateToken';
import { AppError } from '../common/exceptions/AppError';

interface RegisterBody {
  userName: string;
  email?: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

type UserDoc = HydratedDocument<IUser>;

const buildAuthResponse = (user: UserDoc) => ({
  _id: user._id,
  name: user.userName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  token: generateToken(user._id),
});

export const registerUser: RequestHandler<{}, {}, RegisterBody> = asyncHandler(async (req, res) => {
  const { userName, email, password, phoneNumber, address } = req.body;

  if (!email && !phoneNumber) {
    res.status(400);
    throw new Error('Email or phone number is required');
  }

  const conditions: Array<{ email?: string; phoneNumber?: string }> = [];
  if (email) conditions.push({ email });
  if (phoneNumber) conditions.push({ phoneNumber });

  // Check if user exists by email or phoneNumber
  const userExists = await User.findOne({ $or: conditions });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email or phone number');
  }

  const user = await User.create({ userName, email, password, phoneNumber, address });
  res.status(201).json(buildAuthResponse(user));
});

export const loginUser: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new AppError(400, 'Email or phone number is required');
  }

  const user = await User.findOne({ $or: [{ email }, { phoneNumber: email }] });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(401, 'Invalid email/phone or password');
  }
  res.status(200).json(buildAuthResponse(user));
});
