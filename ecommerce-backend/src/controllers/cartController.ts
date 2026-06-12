import { Types } from 'mongoose';
import { CartService } from '../services/cart.service';
import { AuthRequest } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import { Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';

const cartService = new CartService();

const getUserId = (req: AuthRequest): string => {
  return (req.user?._id as Types.ObjectId).toString();
}

const getItemId = (req: AuthRequest): string => {
  const { itemId } = req.params;

  if (Array.isArray(itemId)) return itemId[0];
  return itemId;
}

export const getMyCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await cartService.getCart(getUserId(req));
  return sendSuccess(res, cart)
});

export const addCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await cartService.addItem(getUserId(req), req.body);
  return sendSuccess(res, cart)
})

export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await cartService.updateItem(
    getUserId(req),
    getItemId(req),
    req.body
  );
  return sendSuccess(res, cart)
});

export const removeCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await cartService.removeItem(getUserId(req), getItemId(req));
  return sendSuccess(res, cart)
});

export const clearMyCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await cartService.clearCart(getUserId(req));
  res.status(200).json(cart)
});