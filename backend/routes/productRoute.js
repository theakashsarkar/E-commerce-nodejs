import { Router } from "express";
import { createProduct } from "../controllers/productController.js";
import { uploadMiddleware } from "../utils/fileUpload.js";

const router = Router();
const multiImageUpload = uploadMiddleware.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);
router.post("/", multiImageUpload, createProduct);
export default router;
