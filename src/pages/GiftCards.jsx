import { Edit2, Eye, Plus, Trash2, AlertCircle, Loader } from "lucide-react";
import React, { useState } from "react";

function GiftCards({ giftCardStores, onEdit, onDelete, onCreate, loading }) {
  const [activeStoreId, setActiveStoreId] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader
            size={40}
            className="text-purple-600 animate-spin mx-auto mb-4"
          />
          <p className="text-gray-600">Loading gift card stores...</p>
        </div>
      </div>
    );
  }

  if (!giftCardStores || giftCardStores.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow">
        <p className="text-gray-600 mb-4">No gift card stores found</p>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 mx-auto"
        >
          <Plus size={18} /> Create First Store
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Gift Card Stores</h3>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus size={18} /> Create Store
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftCardStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer"
              onClick={() =>
                setActiveStoreId(activeStoreId === store.id ? null : store.id)
              }
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">
                  {store.image ? (
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    store.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {store.status}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {store.name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{store.description}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{store.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium">${store.rate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gift Cards:</span>
                  <span className="font-medium">
                    {store.cards ? store.cards.length : 0}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit("edit-store");
                  }}
                  className="flex-1 p-2 hover:bg-yellow-50 rounded text-yellow-600 text-sm"
                >
                  <Edit2 size={16} className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(store.id);
                  }}
                  className="flex-1 p-2 hover:bg-red-50 rounded text-red-600 text-sm"
                >
                  <Trash2 size={16} className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gift Cards Table */}
      {activeStoreId !== null && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Gift Cards -{" "}
              {giftCardStores.find((s) => s.id === activeStoreId)?.name}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Card Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const activeStore = giftCardStores.find(
                    (s) => s.id === activeStoreId
                  );
                  const cards = activeStore?.cards || [];

                  if (cards.length === 0) {
                    return (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-center text-gray-600"
                        >
                          No gift cards in this store
                        </td>
                      </tr>
                    );
                  }

                  return cards.map((card, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {card.name || card}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {activeStore?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        ${activeStore?.rate}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiftCards;
