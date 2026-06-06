import { IUser, User } from '../models/User';

export class UserRepository {
  // Get all the user in repo
  async findAll(): Promise<IUser[]> {
    return await User.find({}).select('-password'); // The sign in find {} that means no conditions get all and the minus sign just remove field password
  }

  //Get user follow by id
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-password');
  }

  // Get user follow by email
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  // Create new user
  async create(userData: {
    userName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    address?: string;
  }): Promise<IUser> {
    return await User.create(userData);
  }

  // Update user
  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    /* Partial<IUser> change every field into optional
    Ex: IUser first have the fields: userName, password, address ->>> userName?, password?, address?
    */
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
  }

  // Delete user
  async delete(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}
