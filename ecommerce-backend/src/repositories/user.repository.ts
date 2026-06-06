import { IUser, User, UserDocument } from '../models/User';

export class UserRepository {
  // Get all the user in repo
  async findAll(): Promise<UserDocument[]> {
    return await User.find({}).select('-password'); // The sign in find {} that means no conditions get all and the minus sign just remove field password
  }

  //Get user follow by id
  async findById(id: string): Promise<UserDocument | null> {
    return await User.findById(id).select('-password');
  }

  // Get user follow by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email });
  }

  // Get user follow by phoneNumber
  async findByPhoneNumber(phoneNumber: string): Promise<UserDocument | null> {
    return await User.findOne({ phoneNumber });
  }

  // Create new user
  async create(userData: {
    userName: string;
    email?: string;
    password: string;
    phoneNumber?: string;
    address?: string;
  }): Promise<UserDocument> {
    return await User.create(userData);
  }

  // Update user
  async update(id: string, updateData: Partial<IUser>): Promise<UserDocument | null> {
    /* Partial<IUser> change every field into optional
    Ex: IUser first have the fields: userName, password, address ->>> userName?, password?, address?
    */
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
  }

  // Delete user
  async delete(id: string): Promise<UserDocument | null> {
    return await User.findByIdAndDelete(id);
  }
}
