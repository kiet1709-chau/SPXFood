import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 365 * 24 * 60 * 60 * 1000;

// ================= SIGN UP =================
export const signUp = async (req, res) => {
  try {
    const { displayName, password, email, phone } = req.body;

    if (!displayName || !password || !email || !phone) {
      return res.status(400).json({
        message:
          "Vui lòng nhập đầy đủ họ tên, email, số điện thoại và mật khẩu.",
      });
    }

    // Chuẩn hóa dữ liệu
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // Kiểm tra email đã tồn tại
    const duplicateEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (duplicateEmail) {
      return res.status(409).json({
        message: "Email đã được sử dụng.",
      });
    }

    // Kiểm tra số điện thoại đã tồn tại
    const duplicatePhone = await User.findOne({
      phone: normalizedPhone,
    });

    if (duplicatePhone) {
      return res.status(409).json({
        message: "Số điện thoại đã được sử dụng.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo User
    await User.create({
      displayName: displayName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      hashedPassword,
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signUp", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// ================= SIGN IN =================
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Thiếu email hoặc password.",
      });
    }

    // Tìm User và lấy hashedPassword
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+hashedPassword");

    if (!user) {
      return res.status(401).json({
        message: "Email hoặc password không chính xác.",
      });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (!user.isActive) {
      return res.status(403).json({
        message: "Tài khoản đã bị khóa.",
      });
    }

    // Kiểm tra password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Email hoặc password không chính xác.",
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

    // Tạo Session
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // Lưu Refresh Token vào Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
      path: "/",
    });

    return res.status(200).json({
      message: `User ${user.displayName} đã logged in!`,
      accessToken,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// ================= SIGN OUT =================
export const signOut = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      // Xóa Session
      await Session.deleteOne({
        refreshToken: token,
      });
    }

    // Xóa Cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signOut", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// ================= REFRESH TOKEN =================
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "Token không tồn tại.",
      });
    }

    // Tìm Session
    const session = await Session.findOne({
      refreshToken: token,
    });

    if (!session) {
      return res.status(403).json({
        message: "Token không hợp lệ hoặc đã hết hạn.",
      });
    }

    // Kiểm tra hết hạn
    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      return res.status(403).json({
        message: "Token đã hết hạn.",
      });
    }

    // Kiểm tra User
    const user = await User.findById(session.userId);

    if (!user || !user.isActive) {
      await Session.deleteOne({ _id: session._id });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      return res.status(403).json({
        message: "Tài khoản không tồn tại hoặc đã bị khóa.",
      });
    }

    // Tạo Access Token mới
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

    // Refresh Token Rotation
    const newRefreshToken = crypto.randomBytes(64).toString("hex");

    session.refreshToken = newRefreshToken;

    // Gia hạn Session thêm 365 ngày
    session.expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);

    await session.save();

    // Cập nhật Cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
      path: "/",
    });

    return res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
