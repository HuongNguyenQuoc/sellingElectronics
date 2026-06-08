import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await productService.getAllProducts(req.query.tag as string);
  res.status(200).json(products);
});

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
})

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductById(id as string);
  res.status(200).json(product);
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedProduct = await productService.updateProduct(id as string, req.body);
  res.status(200).json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.deleteProduct(id as string);
  res.status(200).json(product);
});

export { createProduct, deleteProduct, getProductById, getAllProducts, updateProduct };
