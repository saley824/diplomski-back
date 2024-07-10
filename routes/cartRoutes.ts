import express from "express";

import cartController from "../controllers/cartController";

const router = express.Router();

//API POTPIS MORA BITI JEDINSTVEN
router.get("/:userId", cartController.getCart); //added
router.post("/", cartController.addToCart); // added 
router.delete("/:userId/:productId", cartController.removeCartItem);// added
router.put("/increment", cartController.incrementCartItemQuantity);// added

//TODO api state:
//4/4 added
//0 implemented
export default router;
