import { Edit2, Eye, Plus, Trash2 } from "lucide-react";
import React from "react";

function GiftCards({ giftCards, onEdit, onDelete, onCreate }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">
          Gift Card Management
        </h3>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus size={18} /> Create Gift Card
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
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
                  Category
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {giftCards.map((card) => (
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
                    {card.category}
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
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => onEdit("view-card")}
                      className="p-2 hover:bg-blue-50 rounded text-blue-600"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit("edit-card")}
                      className="p-2 hover:bg-yellow-50 rounded text-yellow-600"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(card.id)}
                      className="p-2 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GiftCards;
