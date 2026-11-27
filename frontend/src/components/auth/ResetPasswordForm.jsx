import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { Link, useParams } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";

// Validation
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),

    confirmPassword: z.string().min(8, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({ className, ...props }) {
  const { token } = useParams();
  const { resetPassword } = useAuthStore();

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Đặt lại mật khẩu thất bại:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-border">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Logo và tiêu đề */}
              <div className="flex flex-col items-center text-center gap-2">
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

                <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>

                <p className="text-sm text-muted-foreground text-balance">
                  Hãy tạo mật khẩu mới cho tài khoản SPXFood của bạn.
                </p>
              </div>

              {!token ? (
                <div className="rounded-md bg-red-50 p-4 text-center text-sm text-red-700">
                  Liên kết đặt lại mật khẩu không hợp lệ hoặc bị thiếu. Vui lòng
                  yêu cầu một liên kết mới.
                </div>
              ) : isSuccess ? (
                <>
                  <div className="rounded-md bg-green-50 p-4 text-center text-sm text-green-700">
                    Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng
                    nhập bằng mật khẩu mới.
                  </div>

                  <Button
                    type="button"
                    onClick={() => (window.location.href = "/signin")}
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                  >
                    Đăng nhập ngay
                  </Button>
                </>
              ) : (
                <>
                  {/* Mật khẩu mới */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="password">Mật khẩu mới</Label>

                    <Input
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      {...register("password")}
                    />

                    {errors.password && (
                      <p className="text-destructive text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Xác nhận mật khẩu */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>

                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      {...register("confirmPassword")}
                    />

                    {errors.confirmPassword && (
                      <p className="text-destructive text-sm">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Nút xác nhận */}
                  <Button
                    type="submit"
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                    disabled={isSubmitting || !token}
                  >
                    {isSubmitting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                  </Button>

                  {!token && (
                    <p className="text-destructive text-center text-sm">
                      Liên kết đặt lại mật khẩu không hợp lệ.
                    </p>
                  )}
                </>
              )}

              {!isSuccess && (
                <div className="text-center text-sm">
                  <Link
                    to="/signin"
                    className="font-semibold text-green-700 underline underline-offset-4"
                  >
                    Quay lại đăng nhập
                  </Link>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
