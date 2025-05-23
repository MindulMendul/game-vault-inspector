
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
        return '우수';
      case '중':
        return '양호';
      case '하':
        return '불량';
      default:
        return '알 수 없음';
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
