import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/create/', bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings/');
    return response.data;
  },

  getOwnerBookings: async () => {
    const response = await api.get('/bookings/owner-bookings/');
    return response.data;
  },

  cancelBooking: async (id, reason) => {
    const response = await api.post(`/bookings/${id}/cancel/`, { reason });
    return response.data;
  },
};
