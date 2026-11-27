import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendResetPasswordEmail = async (email, resetUrl) => {
  await transporter.sendMail({
    from: `"SPXFood" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Đặt lại mật khẩu SPXFood",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 24px;
        color: #333;
      ">
        <h2 style="color: #15803d;">SPXFood</h2>

        <h3>Đặt lại mật khẩu</h3>

        <p>
          Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản SPXFood.
        </p>

        <p>
          Nhấn vào nút bên dưới để tạo mật khẩu mới:
        </p>

        <a href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background: #16a34a;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          ">
          Đặt lại mật khẩu
        </a>

        <p style="margin-top: 24px;">
          Liên kết sẽ hết hạn sau 15 phút.
        </p>

        <p>
          Nếu bạn không yêu cầu đặt lại mật khẩu,
          vui lòng bỏ qua email này.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee;" />

        <p style="font-size: 12px; color: #888;">
          Email tự động từ hệ thống SPXFood. Vui lòng không trả lời email này.
        </p>
      </div>
    `,
  });
};
