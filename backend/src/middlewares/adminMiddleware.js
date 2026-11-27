// Middleware kiểm tra quyền Admin
export const adminOnly = (req, res, next) => {
  try {
    // Kiểm tra người dùng đã được xác thực chưa
    if (!req.user) {
      return res.status(401).json({
        message: "Vui lòng đăng nhập để tiếp tục.",
      });
    }

    // Kiểm tra vai trò
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập chức năng này.",
      });
    }

    next();
  } catch (error) {
    console.error("Lỗi adminMiddleware:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống.",
    });
  }
};
