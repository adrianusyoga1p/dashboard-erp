import { UnitConversionTable } from "./unit-conversion-table";

const UnitConversionPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-lg">Unit Conversion Management</h1>
      <UnitConversionTable />
    </div>
  );
};

export default UnitConversionPage;
