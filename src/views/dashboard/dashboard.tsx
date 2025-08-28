import { useRole } from "@/hooks/useRole";
import { ChartTopProducts } from "../../components/chart/top-products";
import { ChartDailyRevenue } from "@/components/chart/daily-revenue";

const Dashboard = () => {
  const { hasGroup } = useRole();
  return (
    <div className="space-y-6">
      {hasGroup("dashboard") ? (
        <>
          <ChartTopProducts />
          <ChartDailyRevenue />
        </>
      ) : (
        <h1 className="font-semibold text-lg">Welcome to Dashboard Page</h1>
      )}
    </div>
  );
};

export default Dashboard;
