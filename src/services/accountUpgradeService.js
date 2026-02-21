import axiosInstance from "./api/axiosConfig";

const accountUpgradeService = {
  // Get all pending level 2 upgrade requests
  getPendingLevel2Requests: () => {
    return axiosInstance.get("/admin/pending/level2/");
  },

  // Get all pending level 3 upgrade requests
  getPendingLevel3Requests: () => {
    return axiosInstance.get("/admin/pending/level3/");
  },

  // Approve level 2 upgrade request
  approveLevel2: (credentialId) => {
    return axiosInstance.post(`/admin/approve/level2/${credentialId}/`);
  },

  // Approve level 3 upgrade request
  approveLevel3: (credentialId) => {
    return axiosInstance.post(`/admin/approve/level3/${credentialId}/`);
  },

  // Reject level 2 upgrade request (if needed)
  rejectLevel2: (credentialId) => {
    return axiosInstance.post(`/admin/reject/level2/${credentialId}/`);
  },

  // Reject level 3 upgrade request (if needed)
  rejectLevel3: (credentialId) => {
    return axiosInstance.post(`/admin/reject/level3/${credentialId}/`);
  },
};

export default accountUpgradeService;
