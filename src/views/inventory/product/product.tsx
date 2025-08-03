import { TableProduct } from "./product-table";

const ProductPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-lg">Product Management</h1>
      <TableProduct />
    </div>
  );
};

export default ProductPage;
