import express from "express";
import { validate } from "../middleware/validation-middleware";
import { productSchemaCreate } from "../validation/product-schema";
import productController from "../controllers/productController";
import imageController from "../controllers/imageController";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
router
  .route("/")
  .post(validate(productSchemaCreate), productController.addNewProduct);
router.delete("/:id", productController.deleteProductById);
router.put("/:id", productController.updateProductById);
router.get("/aa", productController.getProductSorts);
router.post("/imagesUpload", imageController.uploadImages);

export default router;
