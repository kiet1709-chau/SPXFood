import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    // Tài khoản chủ nhà hàng
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Thông tin nhà hàng
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },

    // Hình ảnh
    logo: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },

    // Thông tin hiển thị
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    deliveryTime: {
      type: String,
      default: "20-30 phút",
    },

    // Trạng thái hoạt động
    isActive: {
      type: Boolean,
      default: true,
    },

    // Trạng thái xét duyệt của Admin
    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index hỗ trợ truy vấn
restaurantSchema.index({ ownerId: 1 });
restaurantSchema.index({ approvalStatus: 1, isActive: 1 });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;