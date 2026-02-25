import axiosInstance from "./api/axiosConfig";

const giftCardStoreService = {
  // ============================================
  // GIFT CARD STORE ENDPOINTS
  // ============================================

  // Get all gift card stores
  getAllStores: () => {
    return axiosInstance.get("/admin/list-gift-stores/");
  },

  // Get a specific gift card store
  getStoreById: (id) => {
    return axiosInstance.get(`/admin/get-gift-store/${id}/`);
  },

  // Create a new gift card store
  createStore: (storeData) => {
    return axiosInstance.post("/admin/create-gift-store/", storeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update a gift card store (PUT request)
  updateStore: (id, storeData) => {
    return axiosInstance.put(`/admin/get-gift-store/${id}/`, storeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Partial update a gift card store (PATCH request)
  partialUpdateStore: (id, storeData) => {
    return axiosInstance.patch(`/admin/get-gift-store/${id}/`, storeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete a gift card store
  deleteStore: (id) => {
    return axiosInstance.delete(`/admin/get-gift-store/${id}/`);
  },

  // ============================================
  // GIFT CARD ENDPOINTS
  // ============================================

  // Get all gift cards across all stores
  getAllGiftCards: () => {
    return axiosInstance.get("/admin/list-gift-cards/");
  },

  // Get a specific gift card by ID
  getGiftCardById: (id) => {
    return axiosInstance.get(`/admin/get-gift-card/${id}/`);
  },

  // Create a new gift card
  createGiftCard: (giftCardData) => {
    return axiosInstance.post("/admin/create-gift-card/", giftCardData);
  },

  // Update a gift card (PUT request)
  updateGiftCard: (id, giftCardData) => {
    return axiosInstance.put(`/admin/get-gift-card/${id}/`, giftCardData);
  },

  // Partial update a gift card (PATCH request)
  partialUpdateGiftCard: (id, giftCardData) => {
    return axiosInstance.patch(`/admin/get-gift-card/${id}/`, giftCardData);
  },

  // Delete a gift card
  deleteGiftCard: (id) => {
    return axiosInstance.delete(`/admin/get-gift-card/${id}/`);
  },

  // ============================================
  // ADDITIONAL UTILITY ENDPOINTS
  // ============================================

  // Get store statistics
  getStoreStats: (id) => {
    return axiosInstance.get(`/gift-card-stores/${id}/stats/`);
  },

  // Get all stores with pagination
  getStoresWithPagination: (page = 1, pageSize = 10) => {
    return axiosInstance.get("/admin/list-gift-stores/", {
      params: { page, page_size: pageSize },
    });
  },

  // Search stores by name
  searchStores: (searchTerm) => {
    return axiosInstance.get("/admin/list-gift-stores/", {
      params: { search: searchTerm },
    });
  },

  // Get gift cards for a specific store
  getGiftCardsByStore: (storeId) => {
    return axiosInstance.get("/admin/list-gift-cards/", {
      params: { store: storeId },
    });
  },
};

export default giftCardStoreService;
