import React from "react";
import StatsCard from "../components/StatsCard";

const Overview = ({ stats, giftCardStores }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Top Performing Store</h3>
          <p className="text-3xl font-bold">Amazon</p>
          <p className="text-blue-100 text-sm mt-2">
            1,240 issued • 892 redeemed (72%)
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

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Gift Card Stores
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Store Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Cards
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {giftCardStores?.slice(0, 3).map((store) => (
                <tr
                  key={store.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {store.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {store.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ${store.rate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {store.giftCards.length}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        store.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {store.status}
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
