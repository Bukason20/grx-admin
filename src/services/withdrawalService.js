import axiosInstance from "./api/axiosConfig";

const withdrawalService = {
  // Get all withdrawal requests
  getAllWithdrawals: () => {
    return axiosInstance.get("/admin/withdrawals/");
  },

  // Get a specific withdrawal by ID
  getWithdrawalById: (id) => {
    return axiosInstance.get(`/admin/withdrawals/${id}/`);
  },

  // Process withdrawal (approve or reject)
  processWithdrawal: (id, processData) => {
    return axiosInstance.post(`/admin/withdrawals/${id}/process/`, processData);
  },

  // Approve withdrawal
  approveWithdrawal: (id, transactionReference = "", adminNotes = "") => {
    return axiosInstance.post(`/admin/withdrawals/${id}/process/`, {
      action: "approve",
      reason: "",
      transaction_reference: transactionReference,
      admin_notes: adminNotes,
    });
  },

  // Reject withdrawal
  rejectWithdrawal: (id, reason = "", adminNotes = "") => {
    return axiosInstance.post(`/admin/withdrawals/${id}/process/`, {
      action: "reject",
      reason: reason,
      transaction_reference: "",
      admin_notes: adminNotes,
    });
  },

  // Get audit logs for a specific withdrawal
  getWithdrawalAuditLog: (withdrawalId) => {
    return axiosInstance.get(`/admin/withdrawals/${withdrawalId}/audit-log/`);
  },

  // Get count of pending withdrawals
  getPendingWithdrawalCount: () => {
    return axiosInstance.get("/admin/withdrawals/pending-count/");
  },

  // Get withdrawals with filter (if backend supports it)
  getWithdrawalsByStatus: (status) => {
    return axiosInstance.get("/admin/withdrawals/", {
      params: { status: status },
    });
  },

  // Get withdrawals with pagination
  getWithdrawalsWithPagination: (page = 1, pageSize = 10) => {
    return axiosInstance.get("/admin/withdrawals/", {
      params: { page, page_size: pageSize },
    });
  },
};

export default withdrawalService;
