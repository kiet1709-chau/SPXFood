import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Link } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";

// Validation
const forgotPasswordSchema = z.object({
  email: z.email("Email không hợp lệ"),
});

export function ForgotPasswordForm({ className, ...props }) {
  const { forgotPassword } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
    } catch (error) {
      console.error("Gửi yêu cầu đặt lại mật khẩu thất bại:", error);
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

                <h1 className="text-2xl font-bold">Quên mật khẩu?</h1>

                <p className="text-muted-foreground text-sm text-balance">
                  Đừng lo lắng! Hãy nhập email đã đăng ký. Chúng tôi sẽ gửi cho
                  bạn đường dẫn đặt lại mật khẩu.
                </p>
              </div>

              {/* Thông báo thành công */}
              {isSuccess ? (
                <div className="flex flex-col gap-4 text-center">
                  <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
                    Yêu cầu đã được gửi. Vui lòng kiểm tra email để tiếp tục đặt
                    lại mật khẩu.
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                    onClick={() => setIsSuccess(false)}
                  >
                    Gửi lại yêu cầu
                  </Button>
                </div>
              ) : (
                <>
                  {/* Email */}
                  <div className="flex flex-col gap-3">
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

                  {/* Nút gửi */}
                  <Button
                    type="submit"
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu"}
                  </Button>
                </>
              )}

              {/* Quay lại đăng nhập */}
              <div className="text-center text-sm">
                Nhớ lại mật khẩu rồi?{" "}
                <Link
                  to="/signin"
                  className="font-semibold text-green-700 underline underline-offset-4"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
