const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'The password required at least 8 characters!'],
    validate: { // Regular expression: biểu thức chính quy of mongoose to validate
      validator: function(value) { // Validator get into a function and return true or false to validate the password
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      },
      message: 'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!'
    }
  },
  role: {
    type: String,
    default: 'customer' // default role is customer, but we can change it to admin because of that why i don't set enum for role
  }
}, {
  timestamps: true
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  // If the password is not modified, skip hashing
  if (!this.isModified('password')) return next();
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
userSchema.methods.comparePassword = async function (enteredPassword) { //comparePassword is the function i named for it :))
  // Also methods is object, it allow define these functions
  return await bcrypt.compare(enteredPassword, this.password);
  // return true or false, becase the function compare of bcrypt will compare the password hashed in the database vs password entered by the user
};

module.exports = mongoose.model('User', userSchema);