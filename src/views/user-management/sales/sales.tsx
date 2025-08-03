import { SalesTable } from "./sales-table";

const SalesPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-lg">Sales Management</h1>
      <SalesTable />
    </div>
  );
};

export default SalesPage;
