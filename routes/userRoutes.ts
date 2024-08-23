import express from "express";
import { validate } from "../middleware/validation-middleware";
import {
  userSchemaCreate,
  loginSchema,
  addressSchema,
} from "../validation/user-schema";
import userController from "../controllers/userController";
import authController from "../controllers/authController";

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/userInfo/:id", userController.getUserInfo);
router.post("/signUp", validate(userSchemaCreate), authController.addUser);
// router.post("/signUp", authController.addUser);
router.post("/login", validate(loginSchema), authController.login);

//ADDRESS
router.get("/address/:userId", userController.getUserAddressById);
router.post(
  "/addAddress",
  validate(addressSchema),
  userController.addNewAddress
);
router.put(
  "/updateAddress",
  validate(addressSchema),
  userController.updateAddress
);

// PASSWORD HANDLER
router.patch("/resetPassword", authController.resetPassword);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/changePassword", authController.changePassword);

export default router;
