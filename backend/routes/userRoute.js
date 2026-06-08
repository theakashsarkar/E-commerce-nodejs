import express from "express";
import {
  registerUser,
  verify,
  reVerify,
} from "../controllers/userController.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/verify", verify);
router.post("/reVerify", reVerify);
export default router;
