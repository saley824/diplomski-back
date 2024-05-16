import express from "express";
import savedProductController from "../controllers/savedProductsController";

const router = express.Router();

router.get("/", savedProductController.getSavedProducts);
router.get("/:userId", savedProductController.getSavedProductsByUserId);
router.post("/", savedProductController.saveProduct);
router.delete("/:userId/:productId", savedProductController.deleteSavedProduct);

export default router;
