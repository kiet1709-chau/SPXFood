import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useNavigate } from "react-router";

// Validation
const signUpSchema = z
  .object({
    displayName: z.string().trim().min(1, "Họ và tên không được để trống"),

    email: z.email("Email không hợp lệ"),

    phone: z
      .string()
      .trim()
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .max(11, "Số điện thoại không được quá 11 số")
      .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa chữ số"),

    role: z.enum(["CUSTOMER", "RESTAURANT", "DRIVER"], {
      error: "Vui lòng chọn vai trò",
    }),

    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export function SignupForm({ className, ...props }) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      role: "CUSTOMER",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...signupData } = data;

    try {
      // Gửi dữ liệu đăng ký đến backend
      await signUp(signupData);

      navigate("/signin");
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
    }
  };

  return (
    <div
      className={cn("mx-auto flex w-full max-w-5xl flex-col gap-6", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Cột trái: Form đăng ký */}
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              {/* Header - Logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <Link to="/" className="flex items-center justify-center gap-2">
                  <img
                    src="/logo.svg"
                    alt="SPXFood Logo"
                    className="h-12 w-12 object-contain"
                  />

                  <span className="text-3xl font-bold text-green-700">
                    SPXFood
                  </span>
                </Link>

                <h1 className="text-2xl font-bold">Tạo tài khoản SPXFood</h1>

                <p className="text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng ký để bắt đầu trải nghiệm SPXFood.
                </p>
              </div>

              {/* Họ và tên */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="displayName">Họ và tên</Label>

                <Input
                  id="displayName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  {...register("displayName")}
                />

                {errors.displayName && (
                  <p className="text-destructive text-sm">
                    {errors.displayName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  {...register("email")}
                />

                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Số điện thoại</Label>

                <Input
                  id="phone"
                  type="tel"
                  placeholder="0123456789"
                  {...register("phone")}
                />

                {errors.phone && (
                  <p className="text-destructive text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Vai trò */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Đăng ký với vai trò</Label>

                <select
                  id="role"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  {...register("role")}
                >
                  <option value="CUSTOMER">Khách hàng</option>
                  <option value="RESTAURANT">Nhà hàng</option>
                  <option value="DRIVER">Tài xế giao hàng</option>
                </select>

                {errors.role && (
                  <p className="text-destructive text-sm">
                    {errors.role.message}
                  </p>
                )}

                <p className="text-sm text-muted-foreground">
                  Tài khoản Nhà hàng và Tài xế cần được Admin phê duyệt.
                </p>
              </div>

              {/* Mật khẩu */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Mật khẩu</Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  {...register("password")}
                />

                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>

                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  {...register("confirmPassword")}
                />

                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Nút đăng ký */}
              <Button
                type="submit"
                className="w-full bg-green-600 text-white hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng ký..." : "Tạo tài khoản"}
              </Button>

              {/* Đăng nhập */}
              <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <Link
                  to="/signin"
                  className="font-semibold text-green-700 underline underline-offset-4"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </form>

          {/* Cột phải: Giữ nguyên ảnh signup-04 */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/foodie-signup-hero.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Điều khoản */}
      <div className="text-xs text-balance px-6 text-center text-muted-foreground">
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <a href="#" className="underline underline-offset-4">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="underline underline-offset-4">
          Chính sách bảo mật
        </a>{" "}
        của chúng tôi.
      </div>
    </div>
  );
}
