import { ProductAdd } from "./product-add";
import { TableProduct } from "./table-product";

const Product = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-xl">Product Management</h1>
      <ProductAdd />
      <TableProduct />
    </div>
  );
};

export default Product;
