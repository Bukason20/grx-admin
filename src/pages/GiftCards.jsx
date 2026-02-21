import {
  Edit2,
  Plus,
  Trash2,
  AlertCircle,
  Loader,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";

function GiftCards({
  giftCardStores,
  giftCards,
  onEdit,
  onDelete,
  onDeleteCard,
  onCreate,
  loading,
}) {
  const [expandedStore, setExpandedStore] = useState(null);

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
          onClick={() => onCreate("create-store")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 mx-auto"
        >
          <Plus size={18} /> Create First Store
        </button>
      </div>
    );
  }

  // Get gift cards for a specific store
  const getStoreGiftCards = (storeId) => {
    return giftCards.filter((card) => card.store?.id === storeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">
          Gift Card Stores & Cards
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onCreate("create-card")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={18} /> Create Gift Card
          </button>
          <button
            onClick={() => onCreate("create-store")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus size={18} /> Create Store
          </button>
        </div>
      </div>

      {/* Stores List */}
      <div className="space-y-3">
        {giftCardStores.map((store) => {
          const storeCards = getStoreGiftCards(store.id);
          const isExpanded = expandedStore === store.id;

          return (
            <div
              key={store.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              {/* Store Header */}
              <div
                className="p-6 cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedStore(isExpanded ? null : store.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Expand/Collapse Icon */}
                  <div className="text-gray-400">
                    {isExpanded ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </div>

                  {/* Store Info */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {store.name}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>
                        Category:{" "}
                        <span className="font-medium text-gray-900">
                          {store.category}
                        </span>
                      </span>
                      <span>
                        Gift Cards:{" "}
                        <span className="font-medium text-gray-900">
                          {storeCards.length}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit("edit-store");
                    }}
                    className="p-2 hover:bg-yellow-50 rounded text-yellow-600"
                    title="Edit store"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(store.id);
                    }}
                    className="p-2 hover:bg-red-50 rounded text-red-600"
                    title="Delete store"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Gift Cards Table - Expanded View */}
              {isExpanded && (
                <div className="border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Card Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Rate
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {storeCards.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-6 py-8 text-center text-gray-600"
                            >
                              <div className="flex flex-col items-center gap-3">
                                <p>No gift cards for this store</p>
                                <button
                                  onClick={() => onCreate("create-card")}
                                  className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                                >
                                  Add Gift Card
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          storeCards.map((card) => (
                            <tr
                              key={card.id}
                              className="border-b border-gray-200 hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                {card.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    card.type === "Both"
                                      ? "bg-blue-100 text-blue-800"
                                      : card.type === "Physical"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {card.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                ${card.rate}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <button
                                  onClick={() => onDeleteCard(card.id)}
                                  className="p-1 hover:bg-red-50 rounded text-red-600"
                                  title="Delete card"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GiftCards;
