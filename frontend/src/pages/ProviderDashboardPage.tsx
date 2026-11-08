import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Calendar,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Clock,
  Sparkles,
  Users,
  ShieldAlert,
  Loader2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services/bookingService';
import { homestayService } from '../services/homestayService';
import { destinationService } from '../services/destinationService';
import { Booking, Destination } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ProviderDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalEarnings: 0,
    pendingRequests: 0,
    confirmedCount: 0,
  });
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // New homestay modal state
  const [isAddHomestayOpen, setIsAddHomestayOpen] = useState(false);
  const [newHomestayName, setNewHomestayName] = useState('');
  const [newHomestayDestId, setNewHomestayDestId] = useState('');
  const [newHomestayDesc, setNewHomestayDesc] = useState('');
  const [newHomestayAddress, setNewHomestayAddress] = useState('');
  const [newHomestayCity, setNewHomestayCity] = useState('');
  const [newHomestayState, setNewHomestayState] = useState('');
  const [newHomestayPrice, setNewHomestayPrice] = useState('3200');
  const [newHomestayGuests, setNewHomestayGuests] = useState('4');
  const [newHomestayAmenities, setNewHomestayAmenities] = useState('Free Wi-Fi, Home Cooked Meals, Plantation Walk, Hot Water');
  const [newHomestayImage, setNewHomestayImage] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80');
  const [isCreatingHomestay, setIsCreatingHomestay] = useState(false);
  const [homestayCreateError, setHomestayCreateError] = useState<string | null>(null);

  const fetchProviderData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, destRes] = await Promise.all([
        bookingService.getProviderBookings(),
        destinationService.getAll({ limit: 50 }),
      ]);

      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data.bookings);
        setStats(bookingsRes.data.stats);
      }
      if (destRes.success && destRes.data) {
        setDestinations(destRes.data);
        if (destRes.data.length > 0) {
          setNewHomestayDestId(destRes.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const res = await bookingService.updateStatus(bookingId, status);
      if (res.success) {
        await fetchProviderData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update reservation status');
    }
  };

  const handleCreateHomestay = async (e: React.FormEvent) => {
    e.preventDefault();
    setHomestayCreateError(null);
    setIsCreatingHomestay(true);

    try {
      const amenitiesArr = newHomestayAmenities.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await homestayService.create({
        destinationId: newHomestayDestId,
        name: newHomestayName,
        description: newHomestayDesc,
        address: newHomestayAddress,
        city: newHomestayCity,
        state: newHomestayState,
        pricePerNight: parseFloat(newHomestayPrice),
        maxGuests: parseInt(newHomestayGuests, 10),
        amenities: amenitiesArr,
        images: [newHomestayImage],
        rooms: [
          {
            name: 'Standard Heritage Room',
            roomType: 'Deluxe Room',
            pricePerNight: parseFloat(newHomestayPrice),
            capacity: parseInt(newHomestayGuests, 10),
            bedType: 'King Bed',
          },
        ],
      });

      if (res.success) {
        setIsAddHomestayOpen(false);
        setNewHomestayName('');
        setNewHomestayDesc('');
        setNewHomestayAddress('');
        await fetchProviderData();
      }
    } catch (err: any) {
      setHomestayCreateError(err.response?.data?.message || err.message || 'Failed to create homestay listing');
    } finally {
      setIsCreatingHomestay(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading provider console..." fullPage />;
  }

  return (
    <div className="space-y-8">
      {/* Account Verification Banner */}
      {!user?.isApproved && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-3xl flex items-start gap-3 text-xs text-amber-800">
          <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Account Verification Under Administrator Review</h4>
            <p className="mt-0.5">
              Your service provider registration is currently being verified by the ExploreLocal heritage team. Once approved, all your listings will become publicly bookable.
            </p>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest">
            Host & Guide Command Center
          </span>
          <h1 className="text-3xl font-bold font-serif text-stone-900 mt-1">
            Provider Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your homestay availability, approve reservations, and monitor revenue payouts.
          </p>
        </div>

        <button
          onClick={() => setIsAddHomestayOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition shadow-sm shrink-0 flex items-center gap-1.5 self-start md:self-auto"
        >
          <PlusCircle size={15} />
          Create New Homestay
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Bookings</span>
          <p className="text-3xl font-bold font-serif text-stone-900">{stats.totalBookings}</p>
          <p className="text-[11px] text-stone-500">Reservations across all your listings</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending Approvals</span>
          <p className="text-3xl font-bold font-serif text-amber-700">{stats.pendingRequests}</p>
          <p className="text-[11px] text-stone-500">Awaiting your confirmation</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Confirmed Stays</span>
          <p className="text-3xl font-bold font-serif text-emerald-700">{stats.confirmedCount}</p>
          <p className="text-[11px] text-stone-500">Guaranteed bookings with guests</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forest">Host Earnings</span>
          <p className="text-3xl font-bold font-serif text-forest">{formatCurrency(stats.totalEarnings)}</p>
          <p className="text-[11px] text-stone-500">Total revenue disbursed to your account</p>
        </div>
      </div>

      {/* Guest Reservations Management */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
            <Calendar size={18} className="text-forest" />
            Guest Reservations & Inquiries
          </h2>
          <span className="text-xs font-semibold text-stone-500">{bookings.length} Inquiries</span>
        </div>

        {bookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No customer reservations received yet. Your listings will appear here when tourists book them.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {bookings.map((booking) => (
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
                  </div>

                  <h3 className="text-sm font-bold text-stone-900">
                    Guest: <span className="text-forest">{booking.contactName}</span> ({booking.contactEmail} • {booking.contactPhone})
                  </h3>

                  <p className="text-xs text-stone-600">
                    Listing: <strong>{booking.homestay?.name || booking.tourGuide?.name || booking.culturalExperience?.title}</strong>
                    {booking.room && <span> ({booking.room.name})</span>}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                    {booking.checkInDate && (
                      <span>📅 {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}</span>
                    )}
                    {booking.startDate && (
                      <span>📅 Date: {formatDate(booking.startDate)}</span>
                    )}
                    <span>👤 {booking.numberOfGuests} Guests</span>
                    <span className="font-bold text-stone-800">
                      Amount: {formatCurrency(booking.totalPrice)}
                    </span>
                  </div>

                  {booking.specialRequests && (
                    <p className="text-xs text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200 mt-2">
                      <strong>Special Request:</strong> {booking.specialRequests}
                    </p>
                  )}
                </div>

                {/* Accept / Reject actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {booking.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                        className="px-3.5 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE HOMESTAY MODAL */}
      {isAddHomestayOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 my-8 space-y-4">
            <h3 className="text-xl font-bold font-serif text-stone-900">List a New Homestay</h3>
            <p className="text-xs text-stone-500">Provide details about your ancestral home, eco-cottage, or retreat.</p>

            <form onSubmit={handleCreateHomestay} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Homestay Name</label>
                <input
                  type="text"
                  value={newHomestayName}
                  onChange={(e) => setNewHomestayName(e.target.value)}
                  placeholder="Green Meadows Tea Plantation Bungalow"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Select Region / Destination</label>
                <select
                  value={newHomestayDestId}
                  onChange={(e) => setNewHomestayDestId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none bg-white"
                  required
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newHomestayDesc}
                  onChange={(e) => setNewHomestayDesc(e.target.value)}
                  placeholder="Describe your heritage architecture, host hospitality, nearby rivers, birdwatching..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    value={newHomestayCity}
                    onChange={(e) => setNewHomestayCity(e.target.value)}
                    placeholder="Vythiri"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newHomestayState}
                    onChange={(e) => setNewHomestayState(e.target.value)}
                    placeholder="Kerala"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Street Address</label>
                <input
                  type="text"
                  value={newHomestayAddress}
                  onChange={(e) => setNewHomestayAddress(e.target.value)}
                  placeholder="Estate Road, Post Box 12"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Base Price / Night (₹)</label>
                  <input
                    type="number"
                    value={newHomestayPrice}
                    onChange={(e) => setNewHomestayPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Max Guests Supported</label>
                  <input
                    type="number"
                    value={newHomestayGuests}
                    onChange={(e) => setNewHomestayGuests(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Amenities (Comma-separated)</label>
                <input
                  type="text"
                  value={newHomestayAmenities}
                  onChange={(e) => setNewHomestayAmenities(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hero Photo URL (Unsplash or CDN)</label>
                <input
                  type="url"
                  value={newHomestayImage}
                  onChange={(e) => setNewHomestayImage(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                  required
                />
              </div>

              {homestayCreateError && (
                <p className="text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">{homestayCreateError}</p>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddHomestayOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingHomestay}
                  className="px-5 py-2 bg-forest text-white font-bold rounded-xl hover:bg-forest-700 transition flex items-center gap-1.5"
                >
                  {isCreatingHomestay ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Homestay Listing'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
