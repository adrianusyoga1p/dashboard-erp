import { LayoutNavbar } from "@/components/layout/navbar";
import { LayoutSidebar } from "@/components/layout/sidebar";
import { useScreen } from "@/hooks/useScreen";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function RootLayout() {
  const { token, user, getAuthMe } = useAuthStore();
  const location = useLocation();
  useEffect(() => {
    if (token) {
      getAuthMe();
    }
  }, [location.pathname, token]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      navigate("/login");
    }
  }, [user, token]);

  const isResponsive = useScreen("(max-width: 1024px)");
  const { showSidebar, setShow } = useUIStore();

  useEffect(() => {
    if (isResponsive) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [isResponsive]);

  return (
    <>
      <LayoutNavbar />
      <LayoutSidebar />
      <main
        className={`p-6 mt-16 transition-all duration-300 ${
          isResponsive ? "ml-0" : showSidebar ? "ml-60" : "ml-0"
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
