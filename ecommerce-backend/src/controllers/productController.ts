import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ProductService } from '../services/product.service';
import { sendJson } from '../utils/apiResponse';

const productService = new ProductService();

const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await productService.getAllProducts(req.query.tag as string);
  return sendJson(res, products);
});

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  return sendJson(res, product, 201);
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductById(id as string);
  return sendJson(res, product);
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedProduct = await productService.updateProduct(id as string, req.body);
  return sendJson(res, updatedProduct);
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.deleteProduct(id as string);
  return sendJson(res, product);
});

const createManyProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await productService.createManyProducts(req.body);
  return sendJson(res, products, 201);
});

export { createProduct, deleteProduct, getProductById, getAllProducts, updateProduct, createManyProducts };
