import express from "express";

import cartController from "../controllers/cartController";

const router = express.Router();

//API POTPIS MORA BITI JEDINSTVEN
router.get("/:userId", cartController.getCart);
router.post("/", cartController.addToCart);
router.delete("/:userId/:productId", cartController.removeCartItem);
router.put("/increment", cartController.incrementCartItemQuantity);

export default router;
