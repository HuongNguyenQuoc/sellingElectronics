const Product = require('../models/Product');
const asyncHandler = require('../middlewares/asyncHandler');

const createProduct = asyncHandler(async (req, res) => {
  // Extract product details from the request body
  const { name, description, price, category, brand, stock, images, specs } = req.body;

  // Create a new product instance
  const product = new Product({
    name,
    description,
    price,
    category,
    brand,
    stock,
    images,
    specs
  });

  const createdProduct = await product.save(); // Save the product to the database

  // Return the created product in the response
  res.status(201).json(createdProduct);

});

// Get all products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}); // Fetch all products from the database
    res.status(200).json(products); // Return the products in the response  
});

// Get one product following by id
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.status(200).json(product);
});

// Update product information
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return new value after modify and check the validation of the data
    );

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.status(200).json(product);
});


const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.status(200).json({ message: 'Product deleted successfully'})
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};

