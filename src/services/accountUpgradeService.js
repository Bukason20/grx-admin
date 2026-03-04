import axiosInstance from "./api/axiosConfig";

const accountUpgradeService = {
  // List all pending Level 2 credential submissions
  // GET /admin/pending/level2/
  // Response: [{ id, nin, nin_image, status, approved, user }]
  getPendingLevel2Requests: () => {
    return axiosInstance.get("/admin/pending/level2/");
  },

  // List all pending Level 3 credential submissions
  // GET /admin/pending/level3/
  // Response: [{ id, house_address_1, house_address_2, nearest_bus_stop,
  //              city, state, country, proof_of_address_image,
  //              face_verification_image, status, approved, user }]
  getPendingLevel3Requests: () => {
    return axiosInstance.get("/admin/pending/level3/");
  },

  // Approve Level 2 upgrade — POST /admin/approve/level2/{credential_id}/
  approveLevel2: (credentialId) => {
    return axiosInstance.post(`/admin/approve/level2/${credentialId}/`);
  },

  // Approve Level 3 upgrade — POST /admin/approve/level3/{credential_id}/
  approveLevel3: (credentialId) => {
    return axiosInstance.post(`/admin/approve/level3/${credentialId}/`);
  },

  // Reject Level 2 upgrade — POST /admin/reject/level2/{credential_id}/
  rejectLevel2: (credentialId) => {
    return axiosInstance.post(`/admin/reject/level2/${credentialId}/`);
  },

  // Reject Level 3 upgrade — POST /admin/reject/level3/{credential_id}/
  rejectLevel3: (credentialId) => {
    return axiosInstance.post(`/admin/reject/level3/${credentialId}/`);
  },
};

export default accountUpgradeService;
