import RootLayout from "@/layout/root-layout";
import NotFound from "@/not-found";
import Dashboard from "@/views/dashboard/dashboard";
import { createBrowserRouter } from "react-router-dom";
import auth from "./routes/auth";
import inventory from "./routes/inventory";
import users from "./routes/users";
import report from "./routes/report";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      ...inventory,
      ...users,
      ...report,
    ],
  },
  ...auth,
  { path: "*", Component: NotFound },
]);
