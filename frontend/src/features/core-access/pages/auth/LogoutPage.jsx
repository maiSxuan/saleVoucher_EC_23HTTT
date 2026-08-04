import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/auth-context";

export function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  return null;
}

export default LogoutPage;

