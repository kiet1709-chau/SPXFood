import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold text-destructive">
        403 - Không có quyền truy cập
      </h1>

      <p className="text-muted-foreground">
        Bạn không có quyền truy cập vào trang này.
      </p>

      <Button asChild>
        <Link to="/">Quay về trang chủ</Link>
      </Button>
    </div>
  );
};

export default UnauthorizedPage;
