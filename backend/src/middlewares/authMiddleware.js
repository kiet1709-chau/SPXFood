import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Xác thực người dùng bằng Access Token
export const protectedRoute = async (req, res, next) => {
  try {
    // Lấy token từ Header
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Không tìm thấy Access Token.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Xác minh JWT
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Kiểm tra payload
    if (!decodedUser.userId) {
      return res.status(401).json({
        message: "Access Token không hợp lệ.",
      });
    }

    // Tìm User
    const user = await User.findById(decodedUser.userId);

    if (!user) {
      return res.status(401).json({
        message: "Người dùng không tồn tại.",
      });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (!user.isActive) {
      return res.status(403).json({
        message: "Tài khoản đã bị khóa.",
      });
    }

    // Lưu User vào Request
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access Token đã hết hạn.",
      });
    }

    if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
      return res.status(401).json({
        message: "Access Token không hợp lệ.",
      });
    }

    console.error("Lỗi authMiddleware:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};
