import express from "express";

import orderController from "../controllers/orderController";

const router = express.Router();

//API POTPIS MORA BITI JEDINSTVEN

router.get("/:userId", orderController.getOrders);
router.post("/createOrder/:userId", orderController.makeOrder);

export default router;
