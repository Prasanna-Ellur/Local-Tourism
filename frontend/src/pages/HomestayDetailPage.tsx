import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  Clock,
  ShieldAlert,
  Check,
  Calendar,
  Sparkles,
  Heart,
  Share2,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { homestayService } from '../services/homestayService';
import { Homestay, Room } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { RatingStars } from '../components/common/RatingStars';
import { OpenStreetMap } from '../components/common/OpenStreetMap';
import { ReviewModal } from '../components/common/ReviewModal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

export const HomestayDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking widget state
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(2);

  // Real-time server availability check
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{ isAvailable: boolean; message?: string } | null>(null);

  // Review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Set default initial dates (tomorrow to 3 days ahead)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);

    setCheckInDate(tomorrow.toISOString().split('T')[0]);
    setCheckOutDate(dayAfter.toISOString().split('T')[0]);
  }, []);

  const fetchHomestay = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await homestayService.getById(id);
      if (res.success && res.data) {
        setHomestay(res.data);
        if (res.data.rooms && res.data.rooms.length > 0) {
          setSelectedRoomId(res.data.rooms[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomestay();
  }, [id]);

  // Check room availability whenever room, checkIn or checkOut changes
  useEffect(() => {
    if (!selectedRoomId || !checkInDate || !checkOutDate) return;

    const checkAvailability = async () => {
      try {
        setIsCheckingAvailability(true);
        const res = await homestayService.checkAvailability(selectedRoomId, checkInDate, checkOutDate);
        if (res.success && res.data) {
          setAvailabilityResult({
            isAvailable: res.data.isAvailable,
            message: res.data.isAvailable
              ? 'Selected dates are open and available!'
              : 'Dates are already reserved for this room. Please select alternative dates.',
          });
        }
      } catch (err: any) {
        setAvailabilityResult({
          isAvailable: false,
          message: err.response?.data?.message || 'Failed to verify room availability',
        });
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [selectedRoomId, checkInDate, checkOutDate]);

  if (loading) {
    return <LoadingSpinner message="Loading homestay details..." fullPage />;
  }

  if (!homestay) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold font-serif text-stone-900 mb-2">Homestay Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">The listing you requested is not currently available.</p>
        <Link to="/homestays" className="px-5 py-2.5 bg-forest text-white rounded-xl font-semibold text-sm">
          Return to Homestays
        </Link>
      </div>
    );
  }

  const selectedRoom: Room | undefined = homestay.rooms?.find((r) => r.id === selectedRoomId);
  const roomPrice = selectedRoom?.pricePerNight || homestay.pricePerNight;

  // Calculate pricing breakdown
  const diffDays =
    checkInDate && checkOutDate
      ? Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
      : 1;

  const basePrice = roomPrice * diffDays;
  const serviceFee = Math.round(basePrice * 0.05);
  const taxes = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + serviceFee + taxes;

  const handleProceedToBooking = () => {
    if (!selectedRoom) return;

    const query = new URLSearchParams({
      type: 'HOMESTAY',
      homestayId: homestay.id,
      roomId: selectedRoom.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: String(guestsCount),
    });

    navigate(`/book?${query.toString()}`);
  };

  const images = homestay.images && homestay.images.length > 0 ? homestay.images : [
    { id: '1', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', caption: 'Veranda', homestayId: homestay.id, isFeatured: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-2">
          <Link to="/" className="hover:text-forest">Home</Link>
          <ChevronRight size={12} />
          <Link to="/homestays" className="hover:text-forest">Homestays</Link>
          <ChevronRight size={12} />
          <span className="text-stone-800">{homestay.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">{homestay.name}</h1>
            <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-1.5 mt-1.5">
              <MapPin size={15} className="text-forest" />
              <span>{homestay.address}, {homestay.city}, {homestay.state}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <RatingStars rating={homestay.rating} count={homestay.reviewCount} size={18} />
            <button className="p-2.5 rounded-full border border-stone-200 text-stone-600 hover:text-forest transition">
              <Share2 size={18} />
            </button>
            <button className="p-2.5 rounded-full border border-stone-200 text-stone-600 hover:text-rose-500 transition">
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[420px] rounded-3xl overflow-hidden shadow-sm">
        <div className="md:col-span-2 h-full bg-stone-100 overflow-hidden relative group">
          <img
            src={images[activeImageIndex]?.url || images[0].url}
            alt={homestay.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {images[activeImageIndex]?.caption && (
            <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              {images[activeImageIndex].caption}
            </div>
          )}
        </div>

        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
          {images.slice(0, 4).map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`h-full overflow-hidden rounded-2xl relative transition ${
                activeImageIndex === idx ? 'ring-4 ring-forest' : 'opacity-85 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content & Sticky Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details, Rooms, Host, Rules, Map, Reviews */}
        <div className="lg:col-span-2 space-y-12">
          {/* Host Profile Header */}
          {homestay.provider && (
            <div className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-stone-200/80 shadow-sm">
              <img
                src={homestay.provider.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt={homestay.provider.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-forest"
              />
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-forest">Hosted By</span>
                <h3 className="text-lg font-bold text-stone-900">{homestay.provider.name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{homestay.provider.bio}</p>
              </div>
            </div>
          )}

          {/* About Stay */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-stone-900">About the Residence</h2>
            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {homestay.description}
            </p>
          </section>

          {/* Room Selection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-stone-900">Available Room Types</h2>
            <div className="space-y-3">
              {homestay.rooms?.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    selectedRoomId === room.id
                      ? 'border-forest bg-forest-50/50 shadow-sm ring-1 ring-forest'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-stone-900">{room.name}</h4>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        {room.roomType}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{room.description}</p>
                    <div className="flex items-center gap-4 text-xs text-stone-600 mt-2">
                      <span>👤 Fits {room.capacity} guests</span>
                      <span>🛏️ {room.bedType}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl font-bold text-forest block">
                      {formatCurrency(room.pricePerNight)}
                    </span>
                    <span className="text-[11px] text-stone-500">per night</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Amenities Grid */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-stone-900">Amenities & Conveniences</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {homestay.amenities?.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone-200/80 text-xs font-semibold text-stone-700">
                  <Check size={16} className="text-forest" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* House Rules & Timing */}
          <section className="bg-stone-50 p-6 rounded-3xl border border-stone-200/80 space-y-4">
            <h3 className="text-lg font-bold font-serif text-stone-900">House Policies & Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-forest" />
                <span><strong>Check-in:</strong> {homestay.checkInTime}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-forest" />
                <span><strong>Check-out:</strong> {homestay.checkOutTime}</span>
              </div>
            </div>
            {homestay.houseRules && (
              <p className="text-xs text-stone-600 pt-2 border-t border-stone-200">
                <strong>Host Rules:</strong> {homestay.houseRules}
              </p>
            )}
          </section>

          {/* Map Location */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-stone-900">Neighborhood & Map</h2>
            <OpenStreetMap
              latitude={homestay.latitude}
              longitude={homestay.longitude}
              title={homestay.name}
            />
          </section>

          {/* Reviews List */}
          <section className="space-y-6 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-serif text-stone-900">Guest Experiences</h2>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={homestay.rating} count={homestay.reviewCount} size={16} />
                </div>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition"
                >
                  Write a Review
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition"
                >
                  Log in to Review
                </Link>
              )}
            </div>

            {homestay.reviews && homestay.reviews.length > 0 ? (
              <div className="space-y-4">
                {homestay.reviews.map((rev) => (
                  <div key={rev.id} className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-forest-100 text-forest font-bold flex items-center justify-center text-xs">
                          {rev.user?.name?.charAt(0) || 'G'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">{rev.user?.name}</h4>
                          <span className="text-[11px] text-stone-400">{formatDate(rev.createdAt)}</span>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} size={13} showText={false} />
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>

                    {rev.providerResponse && (
                      <div className="p-3 bg-stone-50 rounded-xl border-l-2 border-forest text-xs space-y-1">
                        <span className="font-semibold text-forest">Host Response:</span>
                        <p className="text-stone-600">{rev.providerResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-4 italic">No guest reviews yet. Be the first to share your thoughts!</p>
            )}
          </section>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="relative">
          <div className="sticky top-28 bg-white p-6 rounded-3xl border border-stone-200 shadow-xl space-y-6">
            <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-2xl font-bold font-serif text-forest">
                  {formatCurrency(roomPrice)}
                </span>
                <span className="text-xs text-stone-500 ml-1">/ night</span>
              </div>
              <RatingStars rating={homestay.rating} count={homestay.reviewCount} size={14} />
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="p-2.5">
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  Check-In
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
                />
              </div>
              <div className="p-2.5 border-l border-stone-200">
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  Check-Out
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Guests Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Guests</label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none bg-white cursor-pointer"
              >
                {Array.from({ length: selectedRoom?.capacity || homestay.maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} Guest{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Status Badge */}
            <div className="p-3 rounded-xl text-xs flex items-center gap-2 border bg-stone-50">
              {isCheckingAvailability ? (
                <span className="text-stone-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Checking calendar availability...
                </span>
              ) : availabilityResult?.isAvailable ? (
                <span className="text-emerald-700 flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Available for these dates!
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-1.5 font-semibold">
                  <AlertCircle size={16} className="text-rose-600" />
                  {availabilityResult?.message || 'Dates not available'}
                </span>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{formatCurrency(roomPrice)} × {diffDays} night{diffDays > 1 ? 's' : ''}</span>
                <span className="font-medium">{formatCurrency(basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee (5%)</span>
                <span className="font-medium">{formatCurrency(serviceFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & GST (12%)</span>
                <span className="font-medium">{formatCurrency(taxes)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                <span>Total Payable</span>
                <span className="text-forest text-base">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {/* Reserve CTA Button */}
            <button
              onClick={handleProceedToBooking}
              disabled={!availabilityResult?.isAvailable || isCheckingAvailability}
              className="w-full py-3.5 px-4 rounded-xl bg-forest text-white font-bold hover:bg-forest-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Reserve Accommodation
            </button>

            <p className="text-[11px] text-stone-400 text-center">
              You won't be charged yet. Instant confirmation upon simulated payment.
            </p>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        targetType="HOMESTAY"
        targetId={homestay.id}
        targetName={homestay.name}
        onReviewSubmitted={fetchHomestay}
      />
    </div>
  );
};
