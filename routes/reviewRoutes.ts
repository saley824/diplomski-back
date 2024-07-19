import express from "express";

import reviewController from "../controllers/reviewController";
import { validate } from "../middleware/validation-middleware";

import { reviewSchemaCreate } from "../validation/review-schema";

const router = express.Router();

//API POTPIS MORA BITI JEDINSTVEN
router.get("/", reviewController.getAllReviews);
router.get("/user", reviewController.getAllReviewsByUserId);
router.get("/isUserRatedProduct/:userId/:productId", reviewController.isUserRatedProduct);
router
  .route("/makeReview")
  .post(validate(reviewSchemaCreate), reviewController.makeReview);
// router.get("/:id", CategoryController.getCategoryById);
// router.get("/superCategories/all", CategoryController.getAllCategories);
// router.get("/:id/subCategories", CategoryController.getAllSubCategoriesById);
// router.post("/addCategory", CategoryController.addNewCategory);
// router.put("/updateCategory", CategoryController.updateCategory);
// router.delete("/", CategoryController.deleteAllCategories);

export default router;
