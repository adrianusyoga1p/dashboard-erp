import { CLientTable } from "./client-table";

const ClientPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-lg">Client Management</h1>
      <CLientTable />
    </div>
  );
};

export default ClientPage;
