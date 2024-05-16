import express from "express";
import { validate } from "../middleware/validation-middleware";
import { productSchemaCreate } from "../validation/product-schema";
import ProductController from "../controllers/productController";
import productController from "../controllers/productController";

const router = express.Router();

router.get("/", ProductController.getAllProducts);
router.get("/product/:id", ProductController.getProductById);
router
  .route("/")
  .post(validate(productSchemaCreate), ProductController.addNewProduct);
router.delete("/:id", productController.deleteProductById);
router.put("/:id", productController.updateProductById);
router.get("/aa", ProductController.getProductSorts);

export default router;
