import api from './api';

export const paymentService = {
  createOrder: async (bookingId) => {
    const response = await api.post('/payments/create-order/', { booking_id: bookingId });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify/', paymentData);
    return response.data;
  },
};
