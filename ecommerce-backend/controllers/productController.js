const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
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

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating product' });
  };
}

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // Fetch all products from the database
    res.status(200).json(products); // Return the products in the response  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching product details' });
  }
}

// Get one product following by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    !product ? res.status(404).json({ message: 'Product not found '}) : res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching product details' });
  }
}

// Update product information
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true} // Return new value after modify and check the validation of the data
    );

    !product 
    ? res.status(404).json({ message: 'Product not found' }) // If product not found, return 404, Example when access the product with wrong id
    : res.status(200).json(product); // If product found, return the updated product

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Server error while updating product' }); // Server don't understand the data, for example when send string to price field, it will return 400 error
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    !product
    ? res.status(404).json({ message: 'Product not found' }) // If product not found, return 404
    : res.status(200).json({ message: 'Product deleted successfully'}); // If product found, return success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};

