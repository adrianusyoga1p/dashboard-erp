import ProductCategoryPage from "@/views/inventory/category/product/product-category";
import UnitCategoryPage from "@/views/inventory/category/unit/unit-category";
import ProductPage from "@/views/inventory/product/product";
import StockInPage from "@/views/inventory/stock-in/stock-in";
import StockOutPage from "@/views/inventory/stock-out/stock-out";
import StockReturnPage from "@/views/inventory/stock-return/stock-return";
import StockSalesPage from "@/views/inventory/stok-sales/stock-sales";
import UnitConversionPage from "@/views/inventory/unit-conversion/unit-conversion";
import UnitPage from "@/views/inventory/unit/unit";

export default [
  {
    path: "product-category",
    Component: ProductCategoryPage,
  },
  {
    path: "unit-category",
    Component: UnitCategoryPage,
  },
  {
    path: "product",
    Component: ProductPage,
  },
  {
    path: "unit",
    Component: UnitPage,
  },
  {
    path: "unit-conversion",
    Component: UnitConversionPage,
  },
  {
    path: "stock-in",
    Component: StockInPage,
  },
  {
    path: "stock-out",
    Component: StockOutPage,
  },
  {
    path: "stock-return",
    Component: StockReturnPage,
  },
  {
    path: "stock-sales",
    Component: StockSalesPage,
  },
];
