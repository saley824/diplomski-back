import express from "express";
import { changeOrderStatus, order } from "../validation/order-schema";
import { validate } from "../middleware/validation-middleware";

import orderController from "../controllers/orderController";

const router = express.Router();

//API POTPIS MORA BITI JEDINSTVEN

router.route("/").get(validate(order), orderController.getOrders);
router.post("/createOrder/:userId", orderController.makeOrder);
router
  .route("/changeStatus")
  .put(validate(changeOrderStatus), orderController.changeOrderStatus);

export default router;
