import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Loader,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function Withdrawals({ withdrawals, onViewDetails, loading }) {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader
            size={40}
            className="text-purple-600 animate-spin mx-auto mb-4"
          />
          <p className="text-gray-600">Loading withdrawals...</p>
        </div>
      </div>
    );
  }

  if (!withdrawals || withdrawals.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow">
        <p className="text-gray-600">No withdrawal requests found</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
        return <CheckCircle size={18} className="text-green-600" />;
      case "rejected":
        return <XCircle size={18} className="text-red-600" />;
      case "pending":
        return <AlertCircle size={18} className="text-yellow-600" />;
      default:
        return <AlertCircle size={18} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h3 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600 mb-2">Total Withdrawals</p>
          <p className="text-3xl font-bold text-gray-900">
            {withdrawals.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600 mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">
            {
              withdrawals.filter((w) => w.status.toLowerCase() === "pending")
                .length
            }
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600 mb-2">Total Amount</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(
              withdrawals.reduce((sum, w) => sum + parseFloat(w.amount), 0),
            )}
          </p>
        </div>
      </div>

      {/* Withdrawals List */}
      <div className="space-y-4">
        {withdrawals.map((withdrawal) => (
          <div
            key={withdrawal.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* Withdrawal Header */}
            <div
              className="p-6 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() =>
                setExpandedId(
                  expandedId === withdrawal.id ? null : withdrawal.id,
                )
              }
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Expand/Collapse Icon */}
                <div className="text-gray-400">
                  {expandedId === withdrawal.id ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </div>

                {/* Withdrawal Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {formatCurrency(withdrawal.amount)}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        withdrawal.status,
                      )}`}
                    >
                      {getStatusIcon(withdrawal.status)}
                      {withdrawal.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(withdrawal.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(withdrawal.id);
                }}
                className="p-2 hover:bg-blue-50 rounded text-blue-600 transition"
                title="View details"
              >
                <Eye size={18} />
              </button>
            </div>

            {/* Withdrawal Details - Expanded */}
            {expandedId === withdrawal.id && (
              <div className="p-6 bg-gray-50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(withdrawal.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <p
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        withdrawal.status,
                      )}`}
                    >
                      {withdrawal.status}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created
                    </label>
                    <p className="text-gray-900">
                      {new Date(withdrawal.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Updated
                    </label>
                    <p className="text-gray-900">
                      {new Date(withdrawal.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* View Full Details Button */}
                <div className="pt-4 border-t border-gray-300">
                  <button
                    onClick={() => onViewDetails(withdrawal.id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Eye size={18} /> View Full Details & Process
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Withdrawals;
