import api from './api';

export const turfService = {
  // Public turf listing with query parameters
  getTurfs: async (params = {}) => {
    const response = await api.get('/turfs/', { params });
    return response.data;
  },

  // Detailed turf information
  getTurfById: async (id) => {
    const response = await api.get(`/turfs/${id}/`);
    return response.data;
  },

  // Sports list
  getSports: async () => {
    const response = await api.get('/turfs/sports/');
    return response.data;
  },

  // Amenities list
  getAmenities: async () => {
    const response = await api.get('/turfs/amenities/');
    return response.data;
  },

  // Availability slots for a specific turf and date
  getAvailability: async (turfId, dateStr) => {
    const response = await api.get(`/turfs/${turfId}/availability/`, {
      params: { date: dateStr },
    });
    return response.data;
  },

  // Toggle turf in user's wishlist
  toggleWishlist: async (turfId) => {
    const response = await api.post(`/turfs/${turfId}/wishlist/`);
    return response.data;
  },

  // Get user's wishlisted turfs
  getWishlist: async () => {
    const response = await api.get('/turfs/wishlist/');
    return response.data;
  },

  // Owner: Get own turfs
  getOwnerTurfs: async () => {
    const response = await api.get('/turfs/owner/my-turfs/');
    return response.data;
  },

  // Owner: Add new turf
  createTurf: async (turfData) => {
    const response = await api.post('/turfs/owner/my-turfs/', turfData);
    return response.data;
  },

  // Owner: Update turf
  updateTurf: async (id, turfData) => {
    const response = await api.put(`/turfs/owner/my-turfs/${id}/`, turfData);
    return response.data;
  },
};
