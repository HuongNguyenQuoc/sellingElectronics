const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    min: [0, 'Price must be a positive number']
  },
  category: {
    type: String,
    required: [true, 'Please add a product category'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please add a product brand'],
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Please add a product stock quantity'],
    default: 0,
  },
  images: [
    {
      type: String
    }
  ],
  specs: {
    type: Map,
    of: String,
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;