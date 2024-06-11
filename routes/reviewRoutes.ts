import express from "express";

import reviewController from "../controllers/reviewController";

const router = express.Router();

//API POTPIS MORA BITI JEDINSTVEN
router.get("/", reviewController.getAllReviews);
router.get("/:userId", reviewController.getAllReviewsByUserId);
router.post("/makeReview", reviewController.makeReview);
// router.get("/:id", CategoryController.getCategoryById);
// router.get("/superCategories/all", CategoryController.getAllCategories);
// router.get("/:id/subCategories", CategoryController.getAllSubCategoriesById);
// router.post("/addCategory", CategoryController.addNewCategory);
// router.put("/updateCategory", CategoryController.updateCategory);
// router.delete("/", CategoryController.deleteAllCategories);

export default router;
