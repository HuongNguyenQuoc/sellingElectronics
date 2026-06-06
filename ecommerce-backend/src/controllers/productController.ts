import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Product } from '../models/Product';

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, category, brand, stock, images, specs } = req.body;

  const product = new Product({
    name,
    description,
    price,
    category,
    brand,
    stock,
    images,
    specs,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json(product);
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json({ message: 'Product deleted successfully' });
});

export { createProduct, deleteProduct, getProductById, getProducts, updateProduct };
