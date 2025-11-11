import { Users } from "lucide-react";
import { StatsCard } from "../stats-card";

export default function StatsCardExample() {
  return (
    <div className="p-8 space-y-4">
      <StatsCard
        title="Active Clients"
        value={24}
        icon={Users}
        description="+3 this month"
      />
    </div>
  );
}
