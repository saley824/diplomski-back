import express from "express";
import { validate } from "../middleware/validation-middleware";
import { userSchemaCreate, loginSchema } from "../validation/user-schema";
import userController from "../controllers/userController";
import authController from "../controllers/authController";

const router = express.Router();

router.get("/", userController.getUsers);
router.post("/signUp", validate(userSchemaCreate), authController.addUser);
router.post("/login", validate(loginSchema), authController.login);

export default router;
