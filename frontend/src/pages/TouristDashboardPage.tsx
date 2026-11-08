import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  ChevronRight,
  Receipt,
  AlertTriangle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';

export const TouristDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Cancellation modal
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancellingBookingId) return;
    try {
      setIsCancelling(true);
      setActionError(null);
      const res = await bookingService.cancel(cancellingBookingId, cancelReason || 'Changed plans');
      if (res.success) {
        setCancellingBookingId(null);
        setCancelReason('');
        await fetchBookings();
      }
    } catch (err: any) {
      setActionError(err.response?.data?.message || err.message || 'Failed to cancel reservation');
    } finally {
      setIsCancelling(false);
    }
  };

  // Metrics
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === 'SUCCESSFUL' && b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." fullPage />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest">
            Traveler Dashboard
          </span>
          <h1 className="text-3xl font-bold font-serif text-stone-900 mt-1">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your past and upcoming regional bookings, itineraries, and trip receipts.
          </p>
        </div>

        <Link
          to="/destinations"
          className="px-5 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition shadow-sm shrink-0 flex items-center gap-1.5 self-start md:self-auto"
        >
          Plan Next Trip
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Trips</span>
          <p className="text-3xl font-bold font-serif text-stone-900">{bookings.length}</p>
          <p className="text-[11px] text-stone-500">Reservations placed on ExploreLocal</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Active & Confirmed</span>
          <p className="text-3xl font-bold font-serif text-emerald-700">{confirmedCount}</p>
          <p className="text-[11px] text-stone-500">{pendingCount} request(s) awaiting approval or payment</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forest">Community Contribution</span>
          <p className="text-3xl font-bold font-serif text-forest">{formatCurrency(totalSpent)}</p>
          <p className="text-[11px] text-stone-500">Directly channeled to local hosts & guides</p>
        </div>
      </div>

      {/* Bookings List Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
            <Calendar size={18} className="text-forest" />
            My Bookings & Reservations
          </h2>
          <span className="text-xs font-semibold text-stone-500">{bookings.length} Records</span>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title="No Bookings Found"
            description="You haven't booked any homestays or cultural experiences yet. Explore authentic regional options now!"
            actionText="Discover Homestays"
            actionLink="/homestays"
          />
        ) : (
          <div className="divide-y divide-stone-100">
            {bookings.map((booking) => {
              const targetTitle =
                booking.homestay?.name ||
                booking.tourGuide?.name ||
                booking.culturalExperience?.title;

              const isEligibleForCancel =
                booking.status === 'PENDING' || booking.status === 'CONFIRMED';

              return (
                <div
                  key={booking.id}
                  className="p-6 hover:bg-stone-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-forest">
                        {booking.bookingReference}
                      </span>
                      <Badge status={booking.status} />
                      <Badge status={booking.paymentStatus} />
                      <span className="text-[11px] font-bold text-stone-400 uppercase">
                        • {booking.bookingType}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900">{targetTitle}</h3>

                    {booking.room && (
                      <p className="text-xs text-stone-500">
                        Room: {booking.room.name} ({booking.room.roomType})
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                      {booking.checkInDate && (
                        <span>📅 {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}</span>
                      )}
                      {booking.startDate && (
                        <span>📅 Activity Date: {formatDate(booking.startDate)}</span>
                      )}
                      <span>👤 {booking.numberOfGuests} Guests</span>
                      <span className="font-semibold text-stone-800">
                        Total: {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {booking.paymentStatus === 'PENDING' && (
                      <Link
                        to={`/payment/${booking.id}`}
                        className="px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition shadow-sm"
                      >
                        Pay Now
                      </Link>
                    )}

                    <Link
                      to={`/booking-confirmation/${booking.id}`}
                      className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition"
                    >
                      Receipt
                    </Link>

                    {isEligibleForCancel && (
                      <button
                        onClick={() => {
                          setCancellingBookingId(booking.id);
                          setActionError(null);
                        }}
                        className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold text-stone-900">Cancel Reservation</h3>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Are you sure you want to cancel this booking? If you have completed payment, a full refund will be automatically scheduled.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reason for Cancellation
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="E.g., Travel date conflict, sudden health issue, emergency..."
                className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
              />
            </div>

            {actionError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg">{actionError}</p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBookingId(null)}
                disabled={isCancelling}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
