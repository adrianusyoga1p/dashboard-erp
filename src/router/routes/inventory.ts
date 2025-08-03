import CategoryPage from "@/views/inventory/category/category";
import ProductPage from "@/views/inventory/product/product";
import StockInPage from "@/views/inventory/stock-in/stock-in";

export default [
  {
    path: "category",
    Component: CategoryPage,
  },
  {
    path: "product",
    Component: ProductPage,
  },
  {
    path: "stock-in",
    Component: StockInPage,
  },
];
