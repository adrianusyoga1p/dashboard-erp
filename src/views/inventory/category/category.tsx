import { CategoryTable } from "./category-table";

const CategoryPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-lg">Category Management</h1>
      <CategoryTable />
    </div>
  );
};

export default CategoryPage;
