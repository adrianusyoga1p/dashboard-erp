import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@/assets/css/global.css";
import { router } from "@/router/router.ts";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
