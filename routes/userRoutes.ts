import express from "express";
import { validate } from "../middleware/validation-middleware";
import { userSchemaCreate } from "../validation/user-schema";
import userController from "../controllers/userController";

const router = express.Router();

router.get("/", userController.getUsers);
router.post("/", validate(userSchemaCreate), userController.addUser);

export default router;
