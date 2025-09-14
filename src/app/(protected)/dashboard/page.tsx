import DashboardHeader from "./components/dashboard-header";
import StatsCards from "./components/stats-card";
import RecentPassword from "./components/recent-password";
import SecurityOverview from "./components/security-overview";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsCards />
      <RecentPassword />
    </div>
  );
}
