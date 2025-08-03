import { authLoader } from "@/utils/utils";
import AdminPage from "@/views/user-management/admin/admin";
import ClientPage from "@/views/user-management/client/client";
import DivisionPage from "@/views/user-management/division/division";
import SalesPage from "@/views/user-management/sales/sales";
import UserPage from "@/views/user-management/user/user";

export default [
  {
    path: "user",
    Component: UserPage,
    loader: authLoader,
  },
  {
    path: "admin",
    Component: AdminPage,
    loader: authLoader,
  },
  {
    path: "division",
    Component: DivisionPage,
    loader: authLoader,
  },
  {
    path: "sales",
    Component: SalesPage,
    loader: authLoader,
  },
  {
    path: "client",
    Component: ClientPage,
    loader: authLoader,
  },
];
