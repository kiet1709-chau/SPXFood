import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";
import { sendResetPasswordEmail } from "../services/emailService.js";

// ==================== CONSTANTS ====================

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 365 * 24 * 60 * 60 * 1000;

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

// ==================== SIGN UP ====================

export const signUp = async (req, res) => {
  try {
    const { displayName, password, email, phone, role } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      typeof displayName !== "string" ||
      typeof password !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof role !== "string"
    ) {
      return res.status(400).json({
        message: "Dữ liệu đăng ký không hợp lệ.",
      });
    }

    if (!displayName.trim() || !email.trim() || !phone.trim() || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 8 ký tự.",
      });
    }

    // Chỉ cho phép đăng ký 3 vai trò công khai
    const allowedRoles = ["CUSTOMER", "DRIVER", "RESTAURANT"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Vai trò đăng ký không hợp lệ.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // Kiểm tra email hoặc số điện thoại đã tồn tại
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email hoặc số điện thoại đã được sử dụng.",
      });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo tài khoản
    await User.create({
      displayName: displayName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Đăng ký tài khoản thành công. Vui lòng đăng nhập.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email hoặc số điện thoại đã được sử dụng.",
      });
    }

    console.error("Lỗi signUp:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống khi đăng ký tài khoản.",
    });
  }
};

// ==================== SIGN IN ====================

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu.",
      });
    }

    // Tìm tài khoản
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+hashedPassword");

    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không chính xác.",
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không chính xác.",
      });
    }

    // Kiểm tra tài khoản bị khóa
    if (!user.isActive) {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị khóa.",
      });
    }

    // Tạo Access Token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );

    // Tạo Refresh Token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Lưu Session vào MongoDB
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // Lưu Refresh Token vào HttpOnly Cookie
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      message: "Đăng nhập thành công.",
      accessToken,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi signIn:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống khi đăng nhập.",
    });
  }
};

// ==================== SIGN OUT ====================

export const signOut = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await Session.deleteOne({ refreshToken });
    }

    res.clearCookie("refreshToken", cookieOptions);

    return res.status(204).send();
  } catch (error) {
    console.error("Lỗi signOut:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống khi đăng xuất.",
    });
  }
};

// ==================== REFRESH TOKEN ====================

export const refreshToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({
        message: "Không tìm thấy Refresh Token.",
      });
    }

    // Tìm Session
    const session = await Session.findOne({
      refreshToken: oldRefreshToken,
    });

    if (!session) {
      res.clearCookie("refreshToken", cookieOptions);

      return res.status(401).json({
        message: "Refresh Token không hợp lệ.",
      });
    }

    // Kiểm tra Session hết hạn
    if (session.expiresAt <= new Date()) {
      await Session.deleteOne({ _id: session._id });
      res.clearCookie("refreshToken", cookieOptions);

      return res.status(401).json({
        message: "Phiên đăng nhập đã hết hạn.",
      });
    }

    // Kiểm tra tài khoản
    const user = await User.findById(session.userId);

    if (!user || !user.isActive) {
      await Session.deleteOne({ _id: session._id });
      res.clearCookie("refreshToken", cookieOptions);

      return res.status(401).json({
        message: "Tài khoản không hợp lệ hoặc đã bị khóa.",
      });
    }

    // Tạo Access Token mới
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );

    // Refresh Token Rotation
    const newRefreshToken = crypto.randomBytes(64).toString("hex");

    session.refreshToken = newRefreshToken;
    session.expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);

    await session.save();

    // Cập nhật Cookie
    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi refreshToken:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống khi làm mới Access Token.",
    });
  }
};

// ==================== FORGOT PASSWORD ====================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Vui lòng nhập email.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+resetPasswordToken +resetPasswordExpires");

    // Không tiết lộ email có tồn tại hay không
    if (!user) {
      return res.status(200).json({
        message:
          "Nếu email tồn tại, bạn sẽ nhận được liên kết đặt lại mật khẩu.",
      });
    }

    // Tạo token đặt lại mật khẩu
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Lưu hash token vào database
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    // Tạo link đặt lại mật khẩu
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendResetPasswordEmail(user.email, resetURL);
    } catch (error) {
      // Xóa token nếu gửi email thất bại
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      throw error;
    }

    return res.status(200).json({
      message: "Nếu email tồn tại, bạn sẽ nhận được liên kết đặt lại mật khẩu.",
    });
  } catch (error) {
    console.error("Lỗi forgotPassword:", error);

    return res.status(500).json({
      message: "Không thể gửi email đặt lại mật khẩu.",
    });
  }
};

// ==================== RESET PASSWORD ====================

export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (
      typeof token !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return res.status(400).json({
        message: "Dữ liệu đặt lại mật khẩu không hợp lệ.",
      });
    }

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin.",
      });
    }

    // Kiểm tra mật khẩu
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Mật khẩu xác nhận không khớp.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 8 ký tự.",
      });
    }

    // Hash token để đối chiếu database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Tìm tài khoản có token hợp lệ
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      });
    }

    // Hash mật khẩu mới
    user.hashedPassword = await bcrypt.hash(password, 10);

    // Xóa token đặt lại mật khẩu
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    // Đăng xuất tất cả phiên đăng nhập hiện tại
    await Session.deleteMany({ userId: user._id });

    // Xóa Refresh Token Cookie hiện tại
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      message: "Đặt lại mật khẩu thành công.",
    });
  } catch (error) {
    console.error("Lỗi resetPassword:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống khi đặt lại mật khẩu.",
    });
  }
};
