import { UserTable } from "./user-table";

const UserPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-lg">User Management</h1>
      <UserTable />
    </div>
  );
};

export default UserPage;
