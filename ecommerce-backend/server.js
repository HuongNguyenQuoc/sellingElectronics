const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Use product routes
app.use('/api/products', productRoutes);

// Use auth routes
app.use('/api/users', authRoutes);

// Test route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server backend cho hệ thống E-commerce đang chạy ngon lành!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
})

