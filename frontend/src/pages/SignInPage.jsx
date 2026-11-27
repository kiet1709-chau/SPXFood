import { SigninForm } from "@/components/auth/signin-form";

const SignInPage = () => {
  return (
    <main className="foodie-page-bg flex min-h-svh w-full items-center justify-center p-4 md:p-8">
      <div className="relative z-10 w-full max-w-5xl">
        <SigninForm />
      </div>
    </main>
  );
};

export default SignInPage;
