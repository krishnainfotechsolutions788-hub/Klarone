import StatCard from "../../components/StatCard";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface InvitationsSummaryCardsProps {
  metrics: {
    pending: number;
    accepted: number;
    expired: number;
    revoked: number;
  };
  onFilter: (filter: string) => void;
}

export function InvitationsSummaryCards({ metrics, onFilter }: InvitationsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Pending"
        icon={Clock}
        primaryValue={metrics.pending}
        primaryLabel="Invitations"
        onClick={() => onFilter('Pending')}
      />
      <StatCard
        title="Accepted"
        icon={CheckCircle2}
        primaryValue={metrics.accepted}
        primaryLabel="Invitations"
        onClick={() => onFilter('Accepted')}
      />
      <StatCard
        title="Expired"
        icon={AlertCircle}
        primaryValue={metrics.expired}
        primaryLabel="Invitations"
        onClick={() => onFilter('Expired')}
      />
      <StatCard
        title="Revoked"
        icon={XCircle}
        primaryValue={metrics.revoked}
        primaryLabel="Invitations"
        onClick={() => onFilter('Revoked')}
      />
    </div>
  );
}
