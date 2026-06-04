import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateToken = (id: String | Types.ObjectId): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) throw new Error('JWT_SECRET is missing');

  return jwt.sign({ id: id.toString() }, secret, { expiresIn: '30d' });
};
