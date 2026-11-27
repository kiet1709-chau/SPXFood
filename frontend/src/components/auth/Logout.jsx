import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const Logout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
    </Button>
  );
};

export default Logout;
