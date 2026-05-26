const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' }); // Generate a JWT token with the user's ID as payload, using a secret key
  // so that each time the user logs in, they will need to provide this token and then the server will verify the token to authenticate
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email }); // return null if not found, otherwise return the user document
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password }); // Create a new user document in the database

    if (user) {
      res.status(201).json({
        _id: user.id, /* So this line why we need _id instead of id, because in the database, the field is _id,
        but when we return the response, we can change object _id to id for better readability and consistency with the frontend
        */
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id) // Generate a token for the newly registered user
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while registering user' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {  // The function comparePassword is defined in the user model
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id) // This line we can use both user._id or user.id satisfy the same purpose,
        // because in the user model, we have defined the field _id, but when we return the response, we can change object _id to id for better readability and consistency
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while logging in user' });
  }
};

module.exports = {
  registerUser,
  loginUser
}