import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function AuthLayout() {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!!user && !!token) {
      navigate("/");
    }
  }, [user, token]);
  return (
    <main className="w-screen h-dvh p-6">
      <Outlet />
    </main>
  );
}

export default AuthLayout;
