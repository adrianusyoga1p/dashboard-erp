import {
  LuLayoutDashboard,
  LuPackage,
  LuChevronRight,
  LuUser,
  LuClipboardList,
  LuX,
} from "react-icons/lu";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRole } from "@/hooks/useRole";
import { useScreen } from "@/hooks/useScreen";
import { useUIStore } from "@/stores/ui";

type MenuItem = {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  show?: boolean;
};

const menuItem = (
  label: string,
  path?: string,
  icon?: React.ReactNode,
  show: boolean = true,
  children?: MenuItem[]
): MenuItem => ({
  label,
  path,
  icon,
  children,
  show,
});

const menuChild = (
  path: string,
  label: string,
  show: boolean = true
): MenuItem => ({
  label,
  path,
  show,
});

export const LayoutSidebar = () => {
  const { pathname } = useLocation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { hasGroup } = useRole();

  const menuSidebar: MenuItem[] = [
    menuItem("Dashboard", "/", <LuLayoutDashboard />, hasGroup("dashboard")),
    menuItem("Inventory", undefined, <LuPackage />, true, [
      menuChild("/category", "Category", hasGroup("category")),
      menuChild("/product", "Product", hasGroup("product")),
      menuChild("/stock-in", "Stock In", hasGroup("stock")),
      // menuChild("/stock-out", "Stock Out", hasGroup("stock")),
    ]),
    menuItem("User Management", undefined, <LuUser />, true, [
      menuChild("/division", "Division", hasGroup("division")),
      menuChild("/admin", "Admin", hasGroup("admin")),
      menuChild("/sales", "Sales", hasGroup("sales")),
      menuChild("/client", "Client", hasGroup("client")),
      menuChild("/user", "User", hasGroup("user")),
    ]),
    menuItem(
      "Report Order",
      "/report-order",
      <LuClipboardList />,
      hasGroup("order")
    ),
  ];

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path || (path !== "/" && pathname.startsWith(path));
  };

  const canShow = (item: MenuItem) => {
    if (!item.children) return item.show !== false;
    return item.show !== false && item.children.some((c) => c.show !== false);
  };

  const hasActiveChild = (menu: MenuItem) => {
    return menu.children?.some((child) => isActive(child.path));
  };

  useEffect(() => {
    const activeParentIndex = menuSidebar.findIndex((menu) =>
      hasActiveChild(menu)
    );
    if (activeParentIndex !== -1) {
      setExpandedIndex(activeParentIndex);
    }
  }, [pathname]);

  const handleMenuClick = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

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
    <aside
      className={`fixed left-0 top-0 bg-white w-60 min-h-dvh z-20 border-r border-gray-200 transition-transform duration-300 ${
        isMobile
          ? showSidebar
            ? "translate-x-0"
            : "-translate-x-full"
          : showSidebar
          ? "translate-x-0"
          : "-translate-x-60"
      }`}
    >
      <div className="h-16 p-3 flex items-center gap-4 justify-between">
        <img src="/img/logo.png" alt="logo" className="h-7 object-contain" />
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center"
          >
            <LuX />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        {menuSidebar.map((menu, index) =>
          canShow(menu) ? (
            menu.children ? (
              <div key={index} className="mb-1">
                <button
                  onClick={() => handleMenuClick(index)}
                  className={`w-full py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-between ${
                    hasActiveChild(menu)
                      ? "bg-gray-100 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div>{menu.icon}</div>
                    <span className="text-left text-sm">{menu.label}</span>
                  </div>
                  <div
                    className={`transition-transform duration-300 ${
                      expandedIndex === index ? "rotate-0" : "rotate-90"
                    }`}
                  >
                    <LuChevronRight size={16} />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="ml-8 mt-1 flex flex-col gap-1">
                    {menu.children.map(
                      (child, childIndex) =>
                        canShow(child) && (
                          <NavLink
                            key={childIndex}
                            to={child.path!}
                            className={`py-2 px-4 rounded-lg transition-colors duration-300 text-sm ${
                              isActive(child.path)
                                ? "bg-black text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {child.label}
                          </NavLink>
                        )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={index}
                to={menu.path!}
                className={`py-3 px-4 rounded-xl transition-colors duration-300 flex items-center gap-2 ${
                  isActive(menu.path)
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <div>{menu.icon}</div>
                <span className="text-left text-sm">{menu.label}</span>
              </NavLink>
            )
          ) : null
        )}
      </div>
    </aside>
  );
};
