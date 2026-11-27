import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-white p-6 md:p-10">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)",
          backgroundSize: "100% 100%",
        }}
      />

      {/* Form */}
      <div className="relative z-10 w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
