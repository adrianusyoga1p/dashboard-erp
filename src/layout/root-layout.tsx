import { LayoutNavbar } from "@/components/layout/navbar";
import { LayoutSidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function RootLayout() {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      navigate("/login");
    }
  }, [user, token]);
  return (
    <>
      <LayoutNavbar />
      <LayoutSidebar />
      <main className="ml-60 p-6 bg-gray-100/50 relative mt-16">
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
