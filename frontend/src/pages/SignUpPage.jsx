import { SignupForm } from "@/components/auth/signup-form";

const SignUpPage = () => {
  return (
    <main className="foodie-page-bg flex min-h-svh w-full items-center justify-center p-4 md:p-8">
      <div className="relative z-10 w-full max-w-5xl">
        <SignupForm />
      </div>
    </main>
  );
};

export default SignUpPage;
