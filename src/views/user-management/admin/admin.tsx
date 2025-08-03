import { AdminTable } from "./admin-table";

const AdminPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-lg">Admin Management</h1>
      <AdminTable />
    </div>
  );
};

export default AdminPage;
