import AuthLayout from "@/layout/auth-layout";
import RootLayout from "@/layout/root-layout";
import NotFound from "@/not-found";
import Login from "@/views/auth/login";
import Dashboard from "@/views/dashboard/dashboard";
import Product from "@/views/product/product";
import { createBrowserRouter, redirect } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      {
        path: "product",
        Component: Product,
      },
    ],
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        index: true,
        loader: () => {
          return redirect("/auth/login");
        },
      },
      { path: "login", Component: Login },
      // { path: "register", Component: Register },
    ],
  },
  {
    path: "login",
    loader: () => {
      return redirect("/auth/login");
    },
  },
  { path: "*", Component: NotFound },
]);
