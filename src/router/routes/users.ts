import AdminPage from "@/views/user-management/admin/admin";
import ClientPage from "@/views/user-management/client/client";
import DivisionPage from "@/views/user-management/division/division";
import SalesPage from "@/views/user-management/sales/sales";
import UserPage from "@/views/user-management/user/user";

export default [
  {
    path: "user",
    Component: UserPage,
  },
  {
    path: "admin",
    Component: AdminPage,
  },
  {
    path: "division",
    Component: DivisionPage,
  },
  {
    path: "sales",
    Component: SalesPage,
  },
  {
    path: "client",
    Component: ClientPage,
  },
];
