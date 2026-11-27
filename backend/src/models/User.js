import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    hashedPassword: {
      type: String,
      required: true,
      select: false,
    },

    avatarUrl: {
      type: String,
      default: null,
    },

    avatarId: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["CUSTOMER", "RESTAURANT", "DRIVER", "ADMIN"],
      default: "CUSTOMER",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
