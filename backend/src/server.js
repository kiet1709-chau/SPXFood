import "dotenv/config";

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./libs/db.js";

// Auth & Admin
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";

// Customer
import restaurantRoute from "./routes/restaurantRoute.js";
import foodRoute from "./routes/foodRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Public routes
app.use("/api/auth", authRoute);
app.use("/api/restaurants", restaurantRoute);
app.use("/api/foods", foodRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);

// User routes
app.use("/api/users", userRoute);

// Admin routes
app.use("/api/admin", adminRoute);

// Khởi động server sau khi kết nối MongoDB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server bắt đầu trên cổng ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Không thể kết nối MongoDB:", error);
    process.exit(1);
  });
