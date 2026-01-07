import React from "react";
import StatsCard from "../components/StatsCard";

const Overview = ({ stats, giftCards }) => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Top Performing Card</h3>
          <p className="text-3xl font-bold">$50 Gift Card</p>
          <p className="text-blue-100 text-sm mt-2">
            856 issued • 634 redeemed (74%)
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">This Month</h3>
          <p className="text-3xl font-bold">$45,230</p>
          <p className="text-green-100 text-sm mt-2">+12% from last month</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Redemption Rate</h3>
          <p className="text-3xl font-bold">68%</p>
          <p className="text-orange-100 text-sm mt-2">3,892 cards redeemed</p>
        </div>
      </div>

      {/* Recent Gift Cards */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Gift Cards
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Issued
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Redeemed
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {giftCards.slice(0, 3).map((card) => (
                <tr
                  key={card.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {card.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ${card.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {card.issued}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {card.redeemed}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        card.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {card.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
