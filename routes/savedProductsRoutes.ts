import express from "express";
import savedProductController from "../controllers/savedProductsController";
import { checkToken } from "../middleware/auth-middleware";

const router = express.Router();

router.get("/", savedProductController.getSavedProducts); // NO NEED TO ADD TO MOBILE
router
  .route("/:userId")
  .get(checkToken, savedProductController.getSavedProductsByUserId); //ADD TO MOBILE
router.get(
  "/checkIsSaved/:userId/:productId",
  savedProductController.checkIfUserSavedProduct
);   //ADD TO MOBILE
router.post("/", savedProductController.saveProduct); //ADD TO MOBILE
router.delete("/:userId/:productId", savedProductController.deleteSavedProduct); //ADD TO MOBILE

// TODO API status:
// 4/4 added
// 0 implemented
export default router;
