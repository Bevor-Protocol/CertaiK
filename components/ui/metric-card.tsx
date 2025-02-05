import React from "react";

type Props = {
  title: string;
  stat: number;
  Icon: React.ElementType;
  children?: React.ReactNode;
};

const MetricCard: React.FC<Props> = ({ title, Icon, stat, children }) => {
  return (
    <div className="border border-gray-800 rounded-md p-2 md:p-3 lg:p-4">
      <div className="flex justify-between text-sm">
        <p className="mb-2">{title}</p>
        <Icon opacity={0.8} size={16} />
      </div>
      <div className="flex justify-between">
        <p className="text-lg font-bold">{stat.toLocaleString()}</p>
        {children}
      </div>
    </div>
  );
};

export default MetricCard;
