import mongoose from "mongoose";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";

// ==============================
// HELPER FUNCTIONS
// ==============================

// Tránh nhập biểu thức Regex tùy ý khi tìm kiếm
const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Phân trang
const getPagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

// Kiểm tra MongoDB ObjectId
const isValidId = (id) => mongoose.isValidObjectId(id);

// ==============================
// 1. QUẢN LÝ TÀI KHOẢN
// ==============================

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "", role = "", isActive = "" } = req.query;

    const filter = {};

    if (search.trim()) {
      const keyword = escapeRegex(search.trim());

      filter.$or = [
        { displayName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ];
    }

    if (role) {
      const validRoles = ["CUSTOMER", "RESTAURANT", "DRIVER", "ADMIN"];

      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: "Vai trò không hợp lệ.",
        });
      }

      filter.role = role;
    }

    if (isActive === "true") filter.isActive = true;
    if (isActive === "false") filter.isActive = false;

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-hashedPassword -resetPasswordToken -resetPasswordExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Lấy danh sách tài khoản thành công.",
      users,
      pagination: {
        currentPage: page,
        pageLimit: limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi getAllUsers:", error);

    return res.status(500).json({
      message: "Không thể lấy danh sách tài khoản.",
    });
  }
};

// GET /api/admin/users/:userId
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidId(userId)) {
      return res.status(400).json({
        message: "ID tài khoản không hợp lệ.",
      });
    }

    const user = await User.findById(userId)
      .select("-hashedPassword -resetPasswordToken -resetPasswordExpires")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản.",
      });
    }

    return res.status(200).json({
      message: "Lấy thông tin tài khoản thành công.",
      user,
    });
  } catch (error) {
    console.error("Lỗi getUserById:", error);

    return res.status(500).json({
      message: "Không thể lấy thông tin tài khoản.",
    });
  }
};

// PATCH /api/admin/users/:userId/status
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (!isValidId(userId)) {
      return res.status(400).json({
        message: "ID tài khoản không hợp lệ.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive phải là true hoặc false.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản.",
      });
    }

    // Không cho Admin tự khóa tài khoản Admin
    if (user.role === "ADMIN") {
      return res.status(403).json({
        message: "Không thể thay đổi trạng thái tài khoản Admin.",
      });
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({
      message: isActive
        ? "Mở khóa tài khoản thành công."
        : "Khóa tài khoản thành công.",
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Lỗi updateUserStatus:", error);

    return res.status(500).json({
      message: "Không thể cập nhật trạng thái tài khoản.",
    });
  }
};

// ==============================
// 2. QUẢN LÝ NHÀ HÀNG
// ==============================

// GET /api/admin/restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "", approvalStatus = "", isActive = "" } = req.query;

    const filter = {};

    if (search.trim()) {
      const keyword = escapeRegex(search.trim());

      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { address: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ];
    }

    if (approvalStatus) {
      const validStatuses = ["PENDING", "APPROVED", "REJECTED"];

      if (!validStatuses.includes(approvalStatus)) {
        return res.status(400).json({
          message: "Trạng thái duyệt không hợp lệ.",
        });
      }

      filter.approvalStatus = approvalStatus;
    }

    if (isActive === "true") filter.isActive = true;
    if (isActive === "false") filter.isActive = false;

    const [restaurants, totalRestaurants] = await Promise.all([
      Restaurant.find(filter)
        .populate("ownerId", "displayName email phone isActive")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Restaurant.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Lấy danh sách nhà hàng thành công.",
      restaurants,
      pagination: {
        currentPage: page,
        pageLimit: limit,
        totalRestaurants,
        totalPages: Math.ceil(totalRestaurants / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi getAllRestaurants:", error);

    return res.status(500).json({
      message: "Không thể lấy danh sách nhà hàng.",
    });
  }
};

// GET /api/admin/restaurants/:restaurantId
export const getRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!isValidId(restaurantId)) {
      return res.status(400).json({
        message: "ID nhà hàng không hợp lệ.",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId)
      .populate("ownerId", "displayName email phone isActive")
      .lean();

    if (!restaurant) {
      return res.status(404).json({
        message: "Không tìm thấy nhà hàng.",
      });
    }

    return res.status(200).json({
      message: "Lấy thông tin nhà hàng thành công.",
      restaurant,
    });
  } catch (error) {
    console.error("Lỗi getRestaurantById:", error);

    return res.status(500).json({
      message: "Không thể lấy thông tin nhà hàng.",
    });
  }
};

// PATCH /api/admin/restaurants/:restaurantId/approval
export const updateRestaurantApproval = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { approvalStatus, rejectionReason = "" } = req.body;

    if (!isValidId(restaurantId)) {
      return res.status(400).json({
        message: "ID nhà hàng không hợp lệ.",
      });
    }

    const validStatuses = ["APPROVED", "REJECTED"];

    if (!validStatuses.includes(approvalStatus)) {
      return res.status(400).json({
        message: "Trạng thái duyệt không hợp lệ.",
      });
    }

    if (approvalStatus === "REJECTED" && !rejectionReason.trim()) {
      return res.status(400).json({
        message: "Vui lòng nhập lý do từ chối nhà hàng.",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        message: "Không tìm thấy nhà hàng.",
      });
    }

    restaurant.approvalStatus = approvalStatus;
    restaurant.rejectionReason =
      approvalStatus === "REJECTED" ? rejectionReason.trim() : "";

    await restaurant.save();

    return res.status(200).json({
      message:
        approvalStatus === "APPROVED"
          ? "Duyệt nhà hàng thành công."
          : "Từ chối nhà hàng thành công.",
      restaurant,
    });
  } catch (error) {
    console.error("Lỗi updateRestaurantApproval:", error);

    return res.status(500).json({
      message: "Không thể cập nhật trạng thái duyệt nhà hàng.",
    });
  }
};

// PATCH /api/admin/restaurants/:restaurantId/status
export const updateRestaurantStatus = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { isActive } = req.body;

    if (!isValidId(restaurantId)) {
      return res.status(400).json({
        message: "ID nhà hàng không hợp lệ.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive phải là true hoặc false.",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        message: "Không tìm thấy nhà hàng.",
      });
    }

    // Không kích hoạt nhà hàng chưa được duyệt
    if (isActive && restaurant.approvalStatus !== "APPROVED") {
      return res.status(400).json({
        message: "Nhà hàng chưa được duyệt nên không thể kích hoạt.",
      });
    }

    restaurant.isActive = isActive;
    await restaurant.save();

    return res.status(200).json({
      message: isActive
        ? "Mở hoạt động nhà hàng thành công."
        : "Tạm ngừng nhà hàng thành công.",
      restaurant,
    });
  } catch (error) {
    console.error("Lỗi updateRestaurantStatus:", error);

    return res.status(500).json({
      message: "Không thể cập nhật trạng thái nhà hàng.",
    });
  }
};

// ==============================
// 3. QUẢN LÝ TÀI XẾ
// ==============================

// GET /api/admin/drivers
export const getAllDrivers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "", isActive = "" } = req.query;

    const filter = { role: "DRIVER" };

    if (search.trim()) {
      const keyword = escapeRegex(search.trim());

      filter.$or = [
        { displayName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ];
    }

    if (isActive === "true") filter.isActive = true;
    if (isActive === "false") filter.isActive = false;

    const [drivers, totalDrivers] = await Promise.all([
      User.find(filter)
        .select("-hashedPassword -resetPasswordToken -resetPasswordExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Lấy danh sách tài xế thành công.",
      drivers,
      pagination: {
        currentPage: page,
        pageLimit: limit,
        totalDrivers,
        totalPages: Math.ceil(totalDrivers / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi getAllDrivers:", error);

    return res.status(500).json({
      message: "Không thể lấy danh sách tài xế.",
    });
  }
};

// GET /api/admin/drivers/:driverId
export const getDriverById = async (req, res) => {
  try {
    const { driverId } = req.params;

    if (!isValidId(driverId)) {
      return res.status(400).json({
        message: "ID tài xế không hợp lệ.",
      });
    }

    const driver = await User.findOne({
      _id: driverId,
      role: "DRIVER",
    })
      .select("-hashedPassword -resetPasswordToken -resetPasswordExpires")
      .lean();

    if (!driver) {
      return res.status(404).json({
        message: "Không tìm thấy tài xế.",
      });
    }

    const assignedOrders = await Order.countDocuments({
      driverId,
      status: { $in: ["READY_FOR_PICKUP", "DELIVERING"] },
    });

    return res.status(200).json({
      message: "Lấy thông tin tài xế thành công.",
      driver,
      assignedOrders,
    });
  } catch (error) {
    console.error("Lỗi getDriverById:", error);

    return res.status(500).json({
      message: "Không thể lấy thông tin tài xế.",
    });
  }
};

// ==============================
// 4. GIÁM SÁT ĐƠN HÀNG
// ==============================

// GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const {
      search = "",
      status = "",
      paymentMethod = "",
      restaurantId = "",
      driverId = "",
    } = req.query;

    const filter = {};

    if (search.trim()) {
      const keyword = escapeRegex(search.trim());

      filter.$or = [
        { orderCode: { $regex: keyword, $options: "i" } },
        { customerName: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ];
    }

    if (status) {
      const validStatuses = [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY_FOR_PICKUP",
        "DELIVERING",
        "DELIVERED",
        "REJECTED",
        "CANCELLED",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Trạng thái đơn hàng không hợp lệ.",
        });
      }

      filter.status = status;
    }

    if (paymentMethod) {
      if (!["COD", "BANK_TRANSFER"].includes(paymentMethod)) {
        return res.status(400).json({
          message: "Phương thức thanh toán không hợp lệ.",
        });
      }

      filter.paymentMethod = paymentMethod;
    }

    if (restaurantId) {
      if (!isValidId(restaurantId)) {
        return res.status(400).json({
          message: "ID nhà hàng không hợp lệ.",
        });
      }

      filter.restaurantId = restaurantId;
    }

    if (driverId) {
      if (!isValidId(driverId)) {
        return res.status(400).json({
          message: "ID tài xế không hợp lệ.",
        });
      }

      filter.driverId = driverId;
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .populate("userId", "displayName email phone")
        .populate("restaurantId", "name address")
        .populate("driverId", "displayName phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công.",
      orders,
      pagination: {
        currentPage: page,
        pageLimit: limit,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi getAllOrders:", error);

    return res.status(500).json({
      message: "Không thể lấy danh sách đơn hàng.",
    });
  }
};

// GET /api/admin/orders/:orderId
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!isValidId(orderId)) {
      return res.status(400).json({
        message: "ID đơn hàng không hợp lệ.",
      });
    }

    const order = await Order.findById(orderId)
      .populate("userId", "displayName email phone")
      .populate("restaurantId", "name address phone")
      .populate("driverId", "displayName phone")
      .lean();

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng.",
      });
    }

    return res.status(200).json({
      message: "Lấy chi tiết đơn hàng thành công.",
      order,
    });
  } catch (error) {
    console.error("Lỗi getOrderById:", error);

    return res.status(500).json({
      message: "Không thể lấy chi tiết đơn hàng.",
    });
  }
};

// PATCH /api/admin/orders/:orderId/assign-driver
export const assignDriver = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { driverId } = req.body;

    if (!isValidId(orderId) || !isValidId(driverId)) {
      return res.status(400).json({
        message: "ID đơn hàng hoặc ID tài xế không hợp lệ.",
      });
    }

    const [order, driver] = await Promise.all([
      Order.findById(orderId),
      User.findOne({
        _id: driverId,
        role: "DRIVER",
        isActive: true,
      }),
    ]);

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng.",
      });
    }

    if (!driver) {
      return res.status(404).json({
        message: "Không tìm thấy tài xế đang hoạt động.",
      });
    }

    if (order.status !== "READY_FOR_PICKUP") {
      return res.status(400).json({
        message: "Chỉ có thể phân công tài xế cho đơn đã sẵn sàng giao.",
      });
    }

    order.driverId = driver._id;
    await order.save();

    return res.status(200).json({
      message: "Phân công tài xế thành công.",
      order,
    });
  } catch (error) {
    console.error("Lỗi assignDriver:", error);

    return res.status(500).json({
      message: "Không thể phân công tài xế.",
    });
  }
};
