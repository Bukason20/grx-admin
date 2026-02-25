import React from "react";

const StatsCard = ({ label, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-[#FF006A]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-green-600 text-sm mt-2">{change} vs last month</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
