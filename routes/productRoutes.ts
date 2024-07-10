import express from "express";
import { validate } from "../middleware/validation-middleware";
import { productSchemaCreate } from "../validation/product-schema";
import productController from "../controllers/productController";
import imageController from "../controllers/imageController";

const router = express.Router();

//THERE ARE TWO CASES ADDED AND IMPLEMENTED

router.get("/", productController.getAllProducts);  // add to mobile
router.get("/product/:id", productController.getProductById); // add to mobile
router
  .route("/")
  .post(validate(productSchemaCreate), productController.addNewProduct); // add to mobile
router.delete("/:id", productController.deleteProductById); // add to mobile
router.put("/:id", productController.updateProductById);  // add to mobile
router.get("/aa", productController.getProductSorts);
router.post("/imagesUpload/:id", imageController.uploadImages);

export default router;
