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

module.exports = {
  createProduct
}