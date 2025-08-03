import { LayoutNavbar } from "@/components/layout/navbar";
import { LayoutSidebar } from "@/components/layout/sidebar";
import { useScreen } from "@/hooks/useScreen";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
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

  const isMobile = useScreen("(max-width: 640px)");
  const { showSidebar, setShow } = useUIStore();

  useEffect(() => {
    if (isMobile) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [isMobile]);

  return (
    <>
      <LayoutNavbar />
      <LayoutSidebar />
      <main
        className={`p-6 mt-16 transition-all duration-300 ${
          isMobile ? "ml-0" : showSidebar ? "ml-60" : "ml-0"
        }`}
      >
        <div className="relative">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default RootLayout;
