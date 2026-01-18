import axiosInstance from "./api/axiosConfig";

const giftCardStoreService = {
  // Get all gift card stores - CORRECTED ENDPOINT
  getAllStores: () => {
    return axiosInstance.get("/admin/list-gift-stores/");
  },

  // Get single gift card store
  getStoreById: (id) => {
    return axiosInstance.get(`/gift-card-stores/${id}/`);
  },

  // Create gift card store
  createStore: (storeData) => {
    return axiosInstance.post("/admin/create-gift-store/", storeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update gift card store
  updateStore: (id, storeData) => {
    return axiosInstance.put(`/gift-card-stores/${id}/`, storeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Partial update gift card store
  partialUpdateStore: (id, storeData) => {
    return axiosInstance.patch(`/gift-card-stores/${id}/`, storeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete gift card store
  deleteStore: (id) => {
    return axiosInstance.delete(`/gift-card-stores/${id}/`);
  },

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

  // Search stores
  searchStores: (searchTerm) => {
    return axiosInstance.get("/admin/list-gift-stores/", {
      params: { search: searchTerm },
    });
  },
};

export default giftCardStoreService;
