import { CustomerTable } from "./customer-table";

const CustomerPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-lg">Customer Management</h1>
      <CustomerTable />
    </div>
  );
};

export default CustomerPage;
