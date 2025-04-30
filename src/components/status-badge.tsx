
import React from 'react';
import { ComponentStatus } from '@/types/game';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ComponentStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = () => {
    switch (status) {
      case '상':
        return 'bg-status-good text-green-800';
      case '중':
        return 'bg-status-medium text-amber-700';
      case '하':
        return 'bg-red-100 text-status-bad';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case '상':
        return 'Good';
      case '중':
        return 'Fair';
      case '하':
        return 'Poor';
      default:
        return 'Unknown';
    }
  };

  return (
    <span className={cn(
      "px-2 py-1 rounded-full text-xs font-medium",
      getStatusColor(),
      className
    )}>
      {status} ({getStatusText()})
    </span>
  );
};

export default StatusBadge;
