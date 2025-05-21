
import React from 'react';

interface ActivityItemProps {
  icon: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  timeAgo: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  description,
  timeAgo,
}) => {
  return (
    <div className="flex items-start">
      <div className={`p-2 rounded-full ${iconBgColor} ${iconColor} flex-shrink-0`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-400">{description}</p>
        <p className="text-xs text-gray-500 mt-1">
          <i className="far fa-clock mr-1"></i>
          {timeAgo}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;
