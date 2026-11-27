import express from "express";

import {
  // Tài khoản
  getAllUsers,
  getUserById,
  updateUserStatus,

  // Nhà hàng
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantApproval,
  updateRestaurantStatus,

  // Tài xế
  getAllDrivers,
  getDriverById,

  // Đơn hàng
  getAllOrders,
  getOrderById,
  assignDriver,
} from "../controllers/adminController.js";

import { protectedRoute } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Tất cả API Admin đều phải đăng nhập và có role ADMIN
router.use(protectedRoute, adminOnly);

// ==============================
// TÀI KHOẢN
// ==============================
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/:userId/status", updateUserStatus);

// ==============================
// NHÀ HÀNG
// ==============================
router.get("/restaurants", getAllRestaurants);
router.get("/restaurants/:restaurantId", getRestaurantById);
router.patch("/restaurants/:restaurantId/approval", updateRestaurantApproval);
router.patch("/restaurants/:restaurantId/status", updateRestaurantStatus);

// ==============================
// TÀI XẾ
// ==============================
router.get("/drivers", getAllDrivers);
router.get("/drivers/:driverId", getDriverById);

// ==============================
// ĐƠN HÀNG
// ==============================
router.get("/orders", getAllOrders);
router.get("/orders/:orderId", getOrderById);
router.patch("/orders/:orderId/assign-driver", assignDriver);

export default router;
