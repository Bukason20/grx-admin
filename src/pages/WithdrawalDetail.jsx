import React, { useState, useEffect } from "react";
import {
  X,
  Loader,
  AlertCircle,
  CheckCircle,
  XCircle,
  Copy,
  Clock,
  User,
  Building2,
  CreditCard,
} from "lucide-react";
import withdrawalService from "../services/withdrawalService";

function WithdrawalDetail({ withdrawalId, onClose, onProcessed }) {
  const [withdrawal, setWithdrawal] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  // Process form state
  const [action, setAction] = useState("approve");
  const [transactionReference, setTransactionReference] = useState("");
  const [reason, setReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchDetails();
  }, [withdrawalId]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch detail and audit log in parallel
      const [withdrawalRes, auditRes] = await Promise.allSettled([
        withdrawalService.getWithdrawalById(withdrawalId),
        withdrawalService.getWithdrawalAuditLog(withdrawalId),
      ]);

      if (withdrawalRes.status === "fulfilled") {
        setWithdrawal(withdrawalRes.value.data);
      } else {
        throw new Error("Failed to fetch withdrawal details");
      }

      if (auditRes.status === "fulfilled") {
        setAuditLog(auditRes.value.data);
      } else {
        console.warn("Audit log unavailable:", auditRes.reason);
        setAuditLog([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to load withdrawal",
      );
      console.error("❌ fetchDetails:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    setError(null);
    setSuccess(null);

    if (action === "approve" && !transactionReference.trim()) {
      setError("Transaction reference is required to approve");
      return;
    }
    if (action === "reject" && !reason.trim()) {
      setError("A rejection reason is required");
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        action,
        reason,
        transaction_reference: transactionReference,
        admin_notes: adminNotes,
      };
      console.log("📤 Processing withdrawal:", payload);
      await withdrawalService.processWithdrawal(withdrawalId, payload);
      setSuccess(`Withdrawal ${action}d successfully!`);
      setTimeout(() => {
        onProcessed(); // triggers list re-fetch in AdminDashboard
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to ${action} withdrawal`);
      console.error("❌ handleProcess:", err);
      setProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Naira formatter
  const formatNaira = (amount) => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return "₦—";
    return `₦${Math.abs(parsed).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle size={16} className="text-green-600" />;
      case "rejected":
        return <XCircle size={16} className="text-red-600" />;
      case "pending":
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getAuditActionStyle = (action) => {
    switch (action?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "created":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ── Loading state ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Loader
            size={40}
            className="text-purple-600 animate-spin mx-auto mb-4"
          />
          <p className="text-gray-600">Loading withdrawal details...</p>
        </div>
      </div>
    );
  }

  // ── Error / not found state ──────────────────────────────────────
  if (!withdrawal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6 text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || "Withdrawal not found"}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const isPending = withdrawal.status?.toLowerCase() === "pending";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Withdrawal #{withdrawal.id}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(withdrawal.status)}`}
              >
                {getStatusIcon(withdrawal.status)}
                {withdrawal.status_display || withdrawal.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────── */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* ── Amount highlight ─────────────────────────────────── */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Withdrawal Amount
              </p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {formatNaira(withdrawal.amount)}
              </p>
            </div>
            <div className="text-right text-sm text-purple-700">
              <p>Requested</p>
              <p className="font-medium">
                {new Date(withdrawal.created_at).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* ── User Info ────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <User size={16} className="text-gray-500" /> User Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {withdrawal.user_full_name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {withdrawal.user_email || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* ── Bank Info ────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Building2 size={16} className="text-gray-500" /> Bank Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {withdrawal.bank_name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Account Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {withdrawal.account_name || "—"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Account Number</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-semibold text-gray-900 tracking-widest">
                    {withdrawal.account_number || "—"}
                  </p>
                  {withdrawal.account_number && (
                    <button
                      onClick={() => copyToClipboard(withdrawal.account_number)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition"
                      title="Copy account number"
                    >
                      <Copy size={14} />
                    </button>
                  )}
                  {copied && (
                    <span className="text-xs text-green-600 font-medium">
                      Copied!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Already-processed info (non-pending) ─────────────── */}
          {!isPending && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard size={16} className="text-gray-500" /> Processing
                Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {withdrawal.transaction_reference && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Transaction Reference
                    </p>
                    <p className="text-sm font-mono font-medium text-gray-900">
                      {withdrawal.transaction_reference}
                    </p>
                  </div>
                )}
                {withdrawal.rejection_reason && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-sm text-red-700 bg-red-50 rounded p-2">
                      {withdrawal.rejection_reason}
                    </p>
                  </div>
                )}
                {withdrawal.admin_notes && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Admin Notes</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                      {withdrawal.admin_notes}
                    </p>
                  </div>
                )}
                {withdrawal.processed_at && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Processed At</p>
                    <p className="text-sm text-gray-900">
                      {new Date(withdrawal.processed_at).toLocaleString(
                        "en-NG",
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Process Form (pending only) ───────────────────────── */}
          {isPending && (
            <div className="bg-white border-2 border-purple-200 rounded-xl p-5 space-y-4">
              <h4 className="font-semibold text-gray-900">
                Process Withdrawal
              </h4>

              {/* Approve / Reject toggle */}
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setAction("approve")}
                  className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition ${
                    action === "approve"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button
                  onClick={() => setAction("reject")}
                  className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition border-l border-gray-300 ${
                    action === "reject"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>

              {/* Approve — transaction reference */}
              {action === "approve" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Transaction Reference{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter transaction reference"
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              )}

              {/* Reject — reason */}
              {action === "reject" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Explain why this withdrawal is being rejected"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                  />
                </div>
              )}

              {/* Admin notes — always visible */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Admin Notes{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="Internal notes — not visible to user"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                />
              </div>
            </div>
          )}

          {/* ── Audit Log ────────────────────────────────────────── */}
          {auditLog.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Audit Log</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {auditLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getAuditActionStyle(log.action)}`}
                          >
                            {log.action_display || log.action}
                          </span>
                          {log.previous_status && log.new_status && (
                            <span className="text-xs text-gray-500">
                              {log.previous_status} → {log.new_status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          By:{" "}
                          <span className="font-medium">
                            {log.performed_by_email}
                          </span>
                        </p>
                        {log.details && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {log.details}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {new Date(log.created_at).toLocaleString("en-NG")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer — only shown for pending withdrawals ──────────── */}
        {isPending && (
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white">
            <button
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleProcess}
              disabled={processing}
              className={`px-6 py-2 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2 text-sm font-medium ${
                action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {processing ? (
                <>
                  <Loader size={15} className="animate-spin" />
                  Processing...
                </>
              ) : action === "approve" ? (
                <>
                  <CheckCircle size={15} /> Approve Withdrawal
                </>
              ) : (
                <>
                  <XCircle size={15} /> Reject Withdrawal
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WithdrawalDetail;
