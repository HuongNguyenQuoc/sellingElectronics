import { Request, Response } from "express";
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

export const addToCart = async (req: Request, res: Response) => {
    try{
        const { userId, productId, colorSelected, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
//TODODOOOOOO: Note xong tí check sau

        //add another
        cart.items.push({ product: product, colorSelected, quantity });
        // note code sai
        await cart.save();
        res.status(200).json(cart);
    }catch (error) {
        res.status(500).json({ message: "Error adding to cart", error });
    }
}

export const getCartItems = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error });
    }
}

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId;
        const itemId = req.params.id;
        const cart = await Cart.findOne({ user: userId });
        if(!cart){
            return res.status(404).json({ message: "Cart not found" });
        }

        //erase item
        cart.items = cart.items.filter(
            (item: any) => item._id.toString() !== itemId
        );
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error removing from cart", error });
    }
}