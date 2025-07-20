import { NavLink, useLocation } from "react-router-dom";

export const LayoutSidebar = () => {
  const menuSidebar = [
    { label: "Dasboard", path: "/" },
    { label: "Product", path: "/product" },
  ];
  const { pathname } = useLocation();
  return (
    <aside className="fixed left-0 top-0 bg-white w-60 min-h-dvh p-6 z-50">
      <div className="flex flex-col gap-1">
        {menuSidebar &&
          menuSidebar.map((menu, i) => (
            <NavLink
              className={`py-3 px-6 rounded-xl transition-colors duration-300 flex items-center gap-2 ${
                menu.path !== pathname
                  ? "hover:bg-gray-400/10 hover:text-black text-black"
                  : "bg-black text-white shadow-xl"
              }`}
              key={i}
              to={menu.path}
            >
              {menu.label}
            </NavLink>
          ))}
      </div>
    </aside>
  );
};
