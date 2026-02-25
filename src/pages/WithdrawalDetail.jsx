import React, { useState, useEffect } from "react";
import {
  X,
  Loader,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Copy,
} from "lucide-react";
import withdrawalService from "../services/withdrawalService";

function WithdrawalDetail({ withdrawalId, onClose, onProcessed }) {
  const [withdrawal, setWithdrawal] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [action, setAction] = useState("approve");
  const [transactionReference, setTransactionReference] = useState("");
  const [reason, setReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchWithdrawalDetails();
  }, [withdrawalId]);

  const fetchWithdrawalDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const withdrawalResponse =
        await withdrawalService.getWithdrawalById(withdrawalId);
      setWithdrawal(withdrawalResponse.data);
      console.log("✅ Withdrawal fetched:", withdrawalResponse.data);

      const auditResponse =
        await withdrawalService.getWithdrawalAuditLog(withdrawalId);
      setAuditLog(auditResponse.data);
      console.log("✅ Audit log fetched:", auditResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to fetch withdrawal details",
      );
      console.error("Error fetching withdrawal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    setError(null);
    setSuccess(null);

    if (action === "approve" && !transactionReference.trim()) {
      setError("Transaction reference is required for approval");
      return;
    }

    if (action === "reject" && !reason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    setProcessing(true);

    try {
      const processData = {
        action: action,
        reason: reason,
        transaction_reference: transactionReference,
        admin_notes: adminNotes,
      };

      console.log("📤 Processing withdrawal:", processData);

      await withdrawalService.processWithdrawal(withdrawalId, processData);

      setSuccess(`Withdrawal ${action}d successfully!`);
      console.log("✅ Withdrawal processed successfully");

      setTimeout(() => {
        onProcessed();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to process withdrawal");
      console.error("Error processing withdrawal:", err);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-12">
          <Loader
            size={40}
            className="text-purple-600 animate-spin mx-auto mb-4"
          />
          <p className="text-gray-600">Loading withdrawal details...</p>
        </div>
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
          <p className="text-red-600">Withdrawal not found</p>
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded text-gray-600"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              Withdrawal Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* User & Amount Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">User Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <p className="font-medium text-gray-900">
                  {withdrawal.user_full_name}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium text-gray-900">
                  {withdrawal.user_email}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Amount</label>
                <p className="font-semibold text-lg text-gray-900">
                  {formatCurrency(withdrawal.amount)}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <p
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    withdrawal.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : withdrawal.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {withdrawal.status}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4 border-t pt-6">
            <h4 className="font-semibold text-gray-900">Bank Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Bank Name</label>
                <p className="font-medium text-gray-900">
                  {withdrawal.bank_name}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Account Name</label>
                <p className="font-medium text-gray-900">
                  {withdrawal.account_name}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Account Number</label>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-medium text-gray-900">
                    {withdrawal.account_number}
                  </p>
                  <button
                    onClick={() => copyToClipboard(withdrawal.account_number)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                    title="Copy account number"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Form */}
          {withdrawal.status === "Pending" && (
            <div className="space-y-4 border-t pt-6">
              <h4 className="font-semibold text-gray-900">
                Process Withdrawal
              </h4>

              {/* Action Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Action
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="approve"
                      checked={action === "approve"}
                      onChange={(e) => setAction(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Approve</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="reject"
                      checked={action === "reject"}
                      onChange={(e) => setAction(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Reject</span>
                  </label>
                </div>
              </div>

              {/* Conditional Fields */}
              {action === "approve" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Transaction Reference *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter transaction reference"
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              {action === "reject" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Rejection Reason *
                  </label>
                  <textarea
                    placeholder="Enter reason for rejection"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Admin Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any additional notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* Audit Log */}
          {auditLog.length > 0 && (
            <div className="space-y-4 border-t pt-6">
              <h4 className="font-semibold text-gray-900">Audit Log</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {auditLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-gray-50 rounded border border-gray-200 text-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {log.action_display || log.action}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          By: {log.performed_by_email}
                        </p>
                        {log.details && (
                          <p className="text-xs text-gray-600 mt-1">
                            {log.details}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {withdrawal.status === "Pending" && (
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white">
            <button
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleProcess}
              disabled={processing}
              className={`px-4 py-2 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2 ${
                action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {processing ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>{action === "approve" ? "Approve" : "Reject"} Withdrawal</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WithdrawalDetail;
