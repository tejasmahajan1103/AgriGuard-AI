import { HealthStatus, AlertSeverity } from '../../types';
import Badge from './Badge';

interface StatusBadgeProps {
  status: HealthStatus | AlertSeverity | string;
  size?: 'sm' | 'md';
}

function getVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  switch (status) {
    case HealthStatus.Excellent:
    case HealthStatus.Good:
      return 'success';
    case HealthStatus.Fair:
    case AlertSeverity.Medium:
    case AlertSeverity.Low:
      return 'warning';
    case HealthStatus.Poor:
    case AlertSeverity.High:
      return 'danger';
    case HealthStatus.Critical:
    case AlertSeverity.Critical:
      return 'danger';
    default:
      return 'default';
  }
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  return (
    <Badge variant={getVariant(status)} size={size} dot>
      {status}
    </Badge>
  );
}
