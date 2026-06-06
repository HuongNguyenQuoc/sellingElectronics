import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../common/exceptions/AppError";
import { IUser, UserDocument } from "../models/User";
import { generateToken } from "../utils/generateToken";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository;
  }

  // Register - Create new User
  async register(userData: {
    userName: string;
    email?: string;
    password: string;
    phoneNumber?: string;
    address?: string;
  }): Promise<{ user: UserDocument; token: string }> {
    if (userData.email) {
      const userByEmail = await this.userRepository.findByEmail(userData.email);
      if (userByEmail) {
        throw new AppError(400, 'Email already exists');
      }
    }

    if (userData.phoneNumber) {
      const userByPhone = await this.userRepository.findByPhoneNumber(userData.phoneNumber);
      if (userByPhone) {
        throw new AppError(400, 'Phone number already exists');
      }
    }

    const user = await this.userRepository.create(userData);
    const token = generateToken(user._id);
    return { user, token};
  }

  // Login - Check email + password
  async login(data: {email?: string; phoneNumber?: string; password: string}): Promise<{ user: UserDocument; token: string }> {
    const { email, phoneNumber, password } = data;

    if (!email && !phoneNumber) throw new AppError(400, 'Email or phone number is required');
    const user = email
      ? await this.userRepository.findByEmail(email)
      : await this.userRepository.findByPhoneNumber(phoneNumber!);

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError(401, 'Invalid email/phone or password')
    }

    const token = generateToken(user._id);
    return { user, token };
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<UserDocument> {
    const user = await this.userRepository.update(id, updateData);
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }

  async deleteUser(id: string): Promise<UserDocument> {
    const user = await this.userRepository.delete(id);
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }
}
