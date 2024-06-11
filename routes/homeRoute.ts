import express from "express";

import cartController from "../controllers/homeController";

const router = express.Router();

//API POTPIS MORA BITI JEDINSTVEN
router.get("/discountedProducts", cartController.getDiscountedProducts);


export default router;
