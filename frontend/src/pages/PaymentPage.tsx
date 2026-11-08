import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { Booking } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MockPaymentModal } from '../components/common/MockPaymentModal';
import { formatCurrency, formatDate } from '../utils/formatters';

export const PaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchBooking = async () => {
    if (!bookingId) return;
    try {
      setLoading(true);
      const res = await bookingService.getById(bookingId);
      if (res.success && res.data) {
        setBooking(res.data);
        if (res.data.paymentStatus === 'SUCCESSFUL') {
          navigate(`/booking-confirmation/${res.data.id}`);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handleProcessPayment = async (
    paymentMethod: 'CARD' | 'UPI' | 'NETBANKING' | 'MOCK',
    mockStatus: 'SUCCESS' | 'FAILED'
  ) => {
    if (!booking) return;

    const res = await paymentService.processPayment({
      bookingId: booking.id,
      paymentMethod,
      mockStatus,
    });

    if (res.success && res.data) {
      setIsModalOpen(false);
      navigate(`/booking-confirmation/${booking.id}`);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Verifying booking session..." fullPage />;
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <AlertCircle size={40} className="text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold font-serif text-stone-900 mb-2">Reservation Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">{errorMsg || 'Could not retrieve your booking record.'}</p>
        <Link to="/" className="px-5 py-2.5 bg-forest text-white rounded-xl text-xs font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <Link to="/" className="hover:text-forest">Home</Link>
        <ChevronRight size={12} />
        <span>Payment Gateway</span>
        <ChevronRight size={12} />
        <span className="text-stone-800">{booking.bookingReference}</span>
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-forest">
          Secure Payment
        </span>
        <h1 className="text-3xl font-bold font-serif text-stone-900">
          Complete Your Reservation
        </h1>
        <p className="text-xs text-stone-500">
          Review summary and choose your preferred checkout method.
        </p>
      </div>

      {/* Main Payment Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-forest-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
              Reservation Reference
            </span>
            <span className="text-2xl font-mono font-bold tracking-tight">
              {booking.bookingReference}
            </span>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-semibold text-stone-300 block">Total Due</span>
            <span className="text-3xl font-serif font-bold text-amber-300">
              {formatCurrency(booking.totalPrice)}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <Receipt size={18} className="text-forest" />
              Reservation Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-600">
              <div>
                <span className="text-stone-400 block text-[11px]">Type & Service</span>
                <strong className="text-stone-900 block text-sm">
                  {booking.homestay?.name || booking.tourGuide?.name || booking.culturalExperience?.title}
                </strong>
                {booking.room && <span>Room: {booking.room.name}</span>}
              </div>

              <div>
                <span className="text-stone-400 block text-[11px]">Traveler</span>
                <strong className="text-stone-900 block">{booking.contactName}</strong>
                <span>{booking.contactEmail} • {booking.contactPhone}</span>
              </div>

              {booking.checkInDate && (
                <div>
                  <span className="text-stone-400 block text-[11px]">Dates</span>
                  <span>{formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}</span>
                </div>
              )}

              <div>
                <span className="text-stone-400 block text-[11px]">Party Size</span>
                <span>{booking.numberOfGuests} Guest{booking.numberOfGuests > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Pricing table */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Base Accommodation / Service Fee</span>
              <span className="font-semibold">{formatCurrency(booking.basePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Community Platform Support (5%)</span>
              <span className="font-semibold">{formatCurrency(booking.serviceFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Regional Eco Taxes (12%)</span>
              <span className="font-semibold">{formatCurrency(booking.taxes)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
              <span>Total Amount</span>
              <span className="text-forest text-base">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>

          {/* Payment Gateway Trigger Button */}
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-forest text-white font-bold hover:bg-forest-700 transition shadow-lg text-sm flex items-center justify-center gap-2 group"
            >
              <CreditCard size={18} />
              Open Payment Checkout ({formatCurrency(booking.totalPrice)})
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <Lock size={12} className="text-emerald-600" />
            <span>256-Bit SSL Mock Gateway Protected • Simulated Environment</span>
          </div>
        </div>
      </div>

      {/* Modal for Simulated Payment */}
      <MockPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookingReference={booking.bookingReference}
        amount={booking.totalPrice}
        onConfirmPayment={handleProcessPayment}
      />
    </div>
  );
};
