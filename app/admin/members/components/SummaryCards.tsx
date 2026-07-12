import StatCard from "../../components/StatCard";
import { Users, UserCheck, Clock, UserMinus, Monitor } from "lucide-react";

interface SummaryCardsProps {
  metrics: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    online: number;
  };
  onFilter: (filter: string) => void;
}

export function SummaryCards({ metrics, onFilter }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard
        title="Total Members"
        icon={Users}
        primaryValue={metrics.total}
        primaryLabel="Total"
        onClick={() => onFilter('all')}
      />
      <StatCard
        title="Active"
        icon={UserCheck}
        primaryValue={metrics.active}
        primaryLabel="Members"
        onClick={() => onFilter('active')}
      />
      <StatCard
        title="Pending"
        icon={Clock}
        primaryValue={metrics.pending}
        primaryLabel="Invitations"
        onClick={() => onFilter('pending')}
      />
      <StatCard
        title="Suspended"
        icon={UserMinus}
        primaryValue={metrics.suspended}
        primaryLabel="Members"
        onClick={() => onFilter('suspended')}
      />
      <StatCard
        title="Online Now"
        icon={Monitor}
        primaryValue={metrics.online}
        primaryLabel="Members"
        onClick={() => onFilter('online')}
      />
    </div>
  );
}
