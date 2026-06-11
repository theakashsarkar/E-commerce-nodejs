import express from "express";
import {
  registerUser,
  verify,
  reVerify,
  login,
  logout,
  forgot,
  verifyOtp,
  changePassword,
  allUser,
  getUserById,
} from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/verify", verify);
router.post("/reVerify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/forgot-password", forgot);
router.post("/verify-otp/:email", verifyOtp);
router.post("/change-password/:email", changePassword);
router.get("/all-user", isAuthenticated, isAdmin, allUser);
router.get("/get-user/:userId", getUserById);
export default router;
