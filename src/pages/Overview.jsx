import React from "react";
import StatsCard from "../components/StatsCard";
import { Loader } from "lucide-react";

const Overview = ({ stats, giftCardStores, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader
            size={40}
            className="text-purple-600 animate-spin mx-auto mb-4"
          />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
          <p className="text-3xl font-bold">
            {giftCardStores?.[0]?.name || "N/A"}
          </p>
          <p className="text-blue-100 text-sm mt-2">
            {giftCardStores?.[0]?.cards?.length || 0} cards • $
            {giftCardStores?.[0]?.rate || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Stores</h3>
          <p className="text-3xl font-bold">{giftCardStores?.length || 0}</p>
          <p className="text-green-100 text-sm mt-2">Active stores</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Gift Cards</h3>
          <p className="text-3xl font-bold">
            {giftCardStores?.reduce(
              (sum, store) => sum + (store.cards?.length || 0),
              0
            ) || 0}
          </p>
          <p className="text-orange-100 text-sm mt-2">Across all stores</p>
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
                    {store.cards?.length || 0}
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
