import express from "express";
import savedProductController from "../controllers/savedProductsController";
import { checkToken } from "../middleware/auth-middleware";

const router = express.Router();

router.get("/", savedProductController.getSavedProducts);
router
  .route("/:userId")
  .get(checkToken, savedProductController.getSavedProductsByUserId);
router.get(
  "/checkIsSaved/:userId/:productId",
  savedProductController.checkIfUserSavedProduct
);
router.post("/", savedProductController.saveProduct);
router.delete("/:userId/:productId", savedProductController.deleteSavedProduct);

export default router;
