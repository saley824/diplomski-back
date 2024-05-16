import express from "express";
import { validate } from "../middleware/validation-middleware";
import { productDiscountSchemaCreate } from "../validation/product-schema";
import ProductDiscountController from "../controllers/productDiscountController";

const router = express.Router();

//DISCOUNT
router
  .route("/discount/addDiscount")
  .post(
    validate(productDiscountSchemaCreate),
    ProductDiscountController.addProductDiscount
  );
router
  .route("/discount/updateDiscount/:id")
  .put(
    validate(productDiscountSchemaCreate),
    ProductDiscountController.updateProductDiscount
  );
router
  .route("/discount/deleteDiscount/:id")
  .delete(ProductDiscountController.deleteProductDiscountById);

export default router;
