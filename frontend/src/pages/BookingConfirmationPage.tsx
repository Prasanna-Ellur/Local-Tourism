import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Printer,
  Home,
  ArrowRight,
  Phone,
  Mail,
} from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';

export const BookingConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      try {
        setLoading(true);
        const res = await bookingService.getById(bookingId);
        if (res.success && res.data) {
          setBooking(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <LoadingSpinner message="Generating confirmation receipt..." fullPage />;
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <h2 className="text-xl font-bold font-serif text-stone-900 mb-2">Reservation Not Found</h2>
        <Link to="/" className="px-5 py-2.5 bg-forest text-white rounded-xl text-xs font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const host =
    booking.homestay?.provider ||
    booking.tourGuide?.provider ||
    booking.culturalExperience?.provider;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Badge & Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={36} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
          Booking Confirmed & Guaranteed
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
          Your Trip Is Officially Booked!
        </h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          We've notified your local host. A confirmation email has been dispatched to{' '}
          <strong className="text-stone-800">{booking.contactEmail}</strong>.
        </p>
      </div>

      {/* Confirmation Card (printable) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Card Header */}
        <div className="bg-forest-900 text-white p-6 sm:p-8 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
              Booking Reference
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold tracking-tight">
              {booking.bookingReference}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-stone-300 block">Status</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              {booking.status}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Reservation Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Stay / Activity Details
            </h3>
            <h2 className="text-xl font-bold font-serif text-stone-900">
              {booking.homestay?.name || booking.tourGuide?.name || booking.culturalExperience?.title}
            </h2>
            {booking.room && (
              <p className="text-xs text-stone-600 mt-0.5">
                Room: <strong className="text-stone-800">{booking.room.name}</strong> ({booking.room.roomType})
              </p>
            )}
            {booking.homestay?.address && (
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                <MapPin size={13} className="text-forest" />
                {booking.homestay.address}, {booking.homestay.city}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-600">
            {booking.checkInDate && (
              <div>
                <span className="text-stone-400 block text-[11px]">Check-In</span>
                <strong className="text-stone-900 block">{formatDate(booking.checkInDate)}</strong>
              </div>
            )}
            {booking.checkOutDate && (
              <div>
                <span className="text-stone-400 block text-[11px]">Check-Out</span>
                <strong className="text-stone-900 block">{formatDate(booking.checkOutDate)}</strong>
              </div>
            )}
            {booking.startDate && (
              <div>
                <span className="text-stone-400 block text-[11px]">Tour Date</span>
                <strong className="text-stone-900 block">{formatDate(booking.startDate)}</strong>
              </div>
            )}
            <div>
              <span className="text-stone-400 block text-[11px]">Guests</span>
              <strong className="text-stone-900 block">{booking.numberOfGuests} Guests</strong>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Total Paid</span>
              <strong className="text-forest block">{formatCurrency(booking.totalPrice)}</strong>
            </div>
          </div>

          {/* Host Contact Details */}
          {host && (
            <div className="p-4 bg-forest-50/60 rounded-2xl border border-forest-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800">
                Host / Guide Contact Information
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-forest-900">
                <div>
                  <p className="font-bold">{host.name}</p>
                  <p className="text-stone-500 text-[11px]">Local Host Partner</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  {host.phone && (
                    <a href={`tel:${host.phone}`} className="flex items-center gap-1.5 text-forest hover:underline">
                      <Phone size={13} /> {host.phone}
                    </a>
                  )}
                  {host.email && (
                    <a href={`mailto:${host.email}`} className="flex items-center gap-1.5 text-forest hover:underline">
                      <Mail size={13} /> {host.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payment receipt confirmation */}
          {booking.payment && (
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Transaction ID: <span className="font-mono text-stone-800">{booking.payment.transactionId}</span></span>
              <span>Paid via {booking.payment.paymentMethod}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 font-semibold hover:bg-stone-50 text-xs flex items-center justify-center gap-1.5"
        >
          <Printer size={15} />
          Print / Save Receipt
        </button>

        <Link
          to="/bookings/my"
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-forest text-white font-semibold hover:bg-forest-700 text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          View in My Reservations
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};
