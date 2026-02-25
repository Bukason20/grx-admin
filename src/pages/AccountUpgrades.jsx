import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Loader,
  AlertCircle,
  MapPin,
  User,
} from "lucide-react";

function AccountUpgrades({
  level2Requests,
  level3Requests,
  onApprove,
  onReject,
  loading,
}) {
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("level2");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader
            size={40}
            className="text-purple-600 animate-spin mx-auto mb-4"
          />
          <p className="text-gray-600">Loading upgrade requests...</p>
        </div>
      </div>
    );
  }

  const requests = activeTab === "level2" ? level2Requests : level3Requests;
  const levelNumber = activeTab === "level2" ? 2 : 3;

  if (!requests || requests.length === 0) {
    return (
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("level2")}
            className={`px-4 py-3 font-medium transition ${
              activeTab === "level2"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Level 2 Upgrades
          </button>
          <button
            onClick={() => setActiveTab("level3")}
            className={`px-4 py-3 font-medium transition ${
              activeTab === "level3"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Level 3 Upgrades
          </button>
        </div>

        {/* Empty State */}
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-600">
            No pending Level {levelNumber} upgrade requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h3 className="text-2xl font-bold text-gray-900">
        Account Upgrade Requests
      </h3>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("level2")}
          className={`px-4 py-3 font-medium transition ${
            activeTab === "level2"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Level 2 Upgrades ({level2Requests?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("level3")}
          className={`px-4 py-3 font-medium transition ${
            activeTab === "level3"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Level 3 Upgrades ({level3Requests?.length || 0})
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* Request Header */}
            <div
              className="p-6 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() =>
                setExpandedRequest(
                  expandedRequest === request.id ? null : request.id,
                )
              }
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {request.user.full_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Level {levelNumber} Upgrade Request
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Request Details - Expanded */}
            {expandedRequest === request.id && (
              <div className="p-6 bg-gray-50 space-y-6">
                {/* Level 2 Details */}
                {levelNumber === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        National ID (NIN)
                      </label>
                      <p className="text-gray-900 font-mono">{request.nin}</p>
                    </div>

                    {request.nin_image && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          NIN Image
                        </label>
                        <div className="mt-2">
                          <img
                            src={request.nin_image}
                            alt="NIN Image"
                            className="max-w-md h-auto rounded-lg border border-gray-300 shadow"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Level 3 Details */}
                {levelNumber === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          House Address 1
                        </label>
                        <p className="text-gray-900">
                          {request.house_address_1}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          House Address 2
                        </label>
                        <p className="text-gray-900">
                          {request.house_address_2 || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nearest Bus Stop
                        </label>
                        <p className="text-gray-900">
                          {request.nearest_bus_stop}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <p className="text-gray-900">{request.city}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <p className="text-gray-900">{request.state}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <p className="text-gray-900">{request.country}</p>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {request.proof_of_address_image && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Proof of Address
                          </label>
                          <img
                            src={request.proof_of_address_image}
                            alt="Proof of Address"
                            className="w-full h-auto rounded-lg border border-gray-300 shadow"
                          />
                        </div>
                      )}

                      {request.face_verification_image && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Face Verification
                          </label>
                          <img
                            src={request.face_verification_image}
                            alt="Face Verification"
                            className="w-full h-auto rounded-lg border border-gray-300 shadow"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-300">
                  <button
                    onClick={() => onApprove(request.id, levelNumber)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    onClick={() => onReject(request.id, levelNumber)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Reject
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

export default AccountUpgrades;
