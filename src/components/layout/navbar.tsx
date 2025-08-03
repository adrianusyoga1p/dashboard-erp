import { useAuthStore } from "@/stores/auth";
import { BaseDropdown } from "../base/dropdown";
import { useScreen } from "@/hooks/useScreen";
import { LuMenu } from "react-icons/lu";
import { useUIStore } from "@/stores/ui";
import { useEffect } from "react";

export const LayoutNavbar = () => {
  const { user, logout } = useAuthStore();
  const isMobile = useScreen("(max-width: 640px)");
  const { toggleSidebar, showSidebar, setShow } = useUIStore();

  useEffect(() => {
    if (isMobile) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [isMobile]);

  return (
    <nav
      className={`fixed top-0 left-0 bg-white px-6 border-b border-gray-200 transition-all duration-300 z-20 ${
        isMobile
          ? "w-full ml-0"
          : showSidebar
          ? "ml-60 w-[calc(100%_-_15rem)]"
          : "ml-0 w-full"
      }`}
    >
      <div className="flex h-16 items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center"
        >
          <LuMenu />
        </button>
        <div className="ml-auto">
          <BaseDropdown
            trigger={
              <button className="flex gap-2 text-start items-center">
                <div className="text-right">
                  <h4 className="font-semibold">
                    {user?.fullName || user?.name}
                  </h4>
                  {(user?.division || user?.role) && (
                    <span className="text-xs">
                      {user?.division?.displayName || user.role?.displayName}
                    </span>
                  )}
                </div>
              </button>
            }
          >
            <button
              className="flex rounded-sm items-center p-2 hover:bg-gray-300/20 w-full"
              onClick={() => logout()}
            >
              Logout
            </button>
          </BaseDropdown>
        </div>
      </div>
    </nav>
  );
};
