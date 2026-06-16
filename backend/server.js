import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoute.js";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/product", productRoute);
app.listen(PORT, async () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
