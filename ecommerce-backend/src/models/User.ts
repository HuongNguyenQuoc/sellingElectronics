import bcrypt from 'bcryptjs';
import mongoose, { HydratedDocument, Model } from 'mongoose';

export interface IUser {
  userName: string;
  email?: string;
  password: string;
  role: string;
  phoneNumber?: string;
  address?: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}
//Document is INTERFACE of Mongoose. It contains method like: _id, save(), deleteOne(), toObject(),...

export interface IUserMethods {
  comparePassword(enteredPassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>; // This is a type of one specifi user
export type UserModel = Model<IUser, IUserMethods, UserDocument>; // Model User will contain type IUser and methods in IUserMethods, and {} is for statics method if we have any (static method is method that we can call directly on the model, not on the instance of the model, ex: User.findByEmail() is static method, but user.comparePassword() is instance method because we need to create an instance of user to call it)

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      sparse: true, // Crucial: allows multiple users to have 'undefined' or null emails if they register with a phone number
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'The password required at least 8 characters!'],
      validate: {
        // Regular expression: biểu thức chính quy of mongoose to validate
        validator: function (value) {
          // Validator get into a function and return true or false to validate the password
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
        message:
          'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!',
      },
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'], // Limit accounts
      default: 'buyer', // default type is buyer, but we can change it to admin because of that why i don't set enum for type
    },
    phoneNumber: {
      type: String,
      sparse: true,
      trim: true,
      unique: true, // Crucial: allows multiple users to have 'undefined' or null phone numbers if they register with an email
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  // If the password is not modified, skip hashing
  if (!this.isModified('password')) return;
  /*
  Because when the user registers account, the password is hashed and saved to the database.
  But when the user updates their profile(ex: change name, email), the password is not modified and the function pre called automatically before each save,
  so we need to check if the password is modified or not, if not, we skip hashing again to avoid hashing the already hashed password.
  */

  // Hash the password with a salt round of 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create a subfunction to compare the password for login
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  //comparePassword is the function i named for it :))
  // Also methods is object, it allow define these functions
  return bcrypt.compare(enteredPassword, this.password);
  // return true or false, because the function compare of bcrypt will compare the password hashed in the database vs password entered by the user
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);