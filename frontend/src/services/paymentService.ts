import api from './api';
import { ApiResponse, Booking, Payment } from '../types';

export const paymentService = {
  async processPayment(data: {
    bookingId: string;
    paymentMethod: 'CARD' | 'UPI' | 'NETBANKING' | 'MOCK';
    mockStatus?: 'SUCCESS' | 'FAILED';
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
  }) {
    const res = await api.post<ApiResponse<{ payment: Payment; booking: Booking; isMock: boolean }>>(
      '/payments/process',
      data
    );
    return res.data;
  },
};
