import { Router } from "express";
const { addToCart, getCartItems, removeFromCart } = require("../controllers/cartController");

const router = Router();
router.post("/", addToCart);
router.get("/", getCartItems);
router.delete("/:id", removeFromCart);