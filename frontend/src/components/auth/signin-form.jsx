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
const signInSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Vui lòng nhập mật khẩu"),
});

export function SigninForm({ className, ...props }) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Đăng nhập và nhận thông tin User
      const user = await signIn(data.email, data.password);

      // Chuyển trang theo Role
      switch (user?.role) {
        case "CUSTOMER":
          navigate("/customer", { replace: true });
          break;

        case "RESTAURANT":
          navigate("/restaurant", { replace: true });
          break;

        case "DRIVER":
          navigate("/driver", { replace: true });
          break;

        case "ADMIN":
          navigate("/admin", { replace: true });
          break;

        default:
          navigate("/signin", { replace: true });
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-border p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Cột trái: Form đăng nhập */}
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Header - Logo */}
              <div className="flex flex-col items-center gap-2 text-center">
                <Link to="/" className="flex items-center justify-center gap-2">
                  <img
                    src="/logo.svg"
                    alt="SPXFood Logo"
                    className="h-10 w-10 object-contain"
                  />

                  <span className="text-2xl font-bold text-green-700">
                    SPXFood
                  </span>
                </Link>

                <h1 className="text-2xl font-bold">Chào mừng bạn quay lại!</h1>

                <p className="text-muted-foreground text-balance">
                  Đăng nhập vào tài khoản SPXFood của bạn
                </p>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="block text-sm">
                  Email
                </Label>

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

              {/* Mật khẩu */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="block text-sm">
                    Mật khẩu
                  </Label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-green-700 underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

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

              {/* Nút đăng nhập */}
              <Button
                type="submit"
                className="w-full bg-green-600 text-white hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              {/* Đăng ký */}
              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-green-700 underline underline-offset-4"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </form>

          {/* Cột phải: Ảnh minh họa */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/foodie-login-hero.jpg"
              alt="SPXFood"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Điều khoản */}
      <div className="px-6 text-center text-xs text-balance text-muted-foreground">
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
