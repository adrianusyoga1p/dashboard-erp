import AuthLayout from "@/layout/auth-layout";
import Login from "@/views/auth/login";
import { redirect } from "react-router-dom";

export default [
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
    ],
  },
  {
    path: "login",
    loader: () => {
      return redirect("/auth/login");
    },
  },
]