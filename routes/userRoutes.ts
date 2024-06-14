import express from "express";
import { validate } from "../middleware/validation-middleware";
import { userSchemaCreate, loginSchema } from "../validation/user-schema";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/", userController.getUsers);
router.post("/", validate(userSchemaCreate), userController.addUser);
router.post("/login", validate(loginSchema), userController.login);

export default router;
