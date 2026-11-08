import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { homestayService } from '../services/homestayService';
import { guideService } from '../services/guideService';
import { experienceService } from '../services/experienceService';
import { bookingService } from '../services/bookingService';
import { Homestay, Room, TourGuide, CulturalExperience } from '../types';
import { formatCurrency } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const bookingType = (searchParams.get('type') || 'HOMESTAY') as 'HOMESTAY' | 'GUIDE' | 'EXPERIENCE';
  const homestayId = searchParams.get('homestayId') || '';
  const roomId = searchParams.get('roomId') || '';
  const tourGuideId = searchParams.get('tourGuideId') || searchParams.get('targetId') || '';
  const experienceId = searchParams.get('experienceId') || searchParams.get('targetId') || '';

  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialStartDate = searchParams.get('startDate') || searchParams.get('date') || '';
  const initialGuests = parseInt(searchParams.get('guests') || '1', 10);

  // Form states
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [guide, setGuide] = useState<TourGuide | null>(null);
  const [experience, setExperience] = useState<CulturalExperience | null>(null);

  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [numberOfGuests, setNumberOfGuests] = useState(initialGuests);

  const [contactName, setContactName] = useState(user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  const [loadingTarget, setLoadingTarget] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Set default dates if empty
  useEffect(() => {
    if (!checkInDate && !checkOutDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 3);
      setCheckInDate(tomorrow.toISOString().split('T')[0]);
      setCheckOutDate(dayAfter.toISOString().split('T')[0]);
    }
    if (!startDate) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 5);
      setStartDate(nextWeek.toISOString().split('T')[0]);
    }
  }, []);

  // Update contact info when user logs in
  useEffect(() => {
    if (user) {
      if (!contactName) setContactName(user.name);
      if (!contactEmail) setContactEmail(user.email);
      if (!contactPhone && user.phone) setContactPhone(user.phone);
    }
  }, [user]);

  // Fetch target details
  useEffect(() => {
    const fetchTargetData = async () => {
      try {
        setLoadingTarget(true);
        if (bookingType === 'HOMESTAY' && homestayId) {
          const res = await homestayService.getById(homestayId);
          if (res.success && res.data) {
            setHomestay(res.data);
            const foundRoom = res.data.rooms?.find((r) => r.id === roomId) || res.data.rooms?.[0] || null;
            setSelectedRoom(foundRoom);
          }
        } else if (bookingType === 'GUIDE' && tourGuideId) {
          const res = await guideService.getById(tourGuideId);
          if (res.success && res.data) {
            setGuide(res.data);
          }
        } else if (bookingType === 'EXPERIENCE' && experienceId) {
          const res = await experienceService.getById(experienceId);
          if (res.success && res.data) {
            setExperience(res.data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTarget(false);
      }
    };

    fetchTargetData();
  }, [bookingType, homestayId, roomId, tourGuideId, experienceId]);

  // Calculate pricing
  let basePrice = 0;
  let targetTitle = '';
  let targetLocation = '';

  if (bookingType === 'HOMESTAY') {
    const nights =
      checkInDate && checkOutDate
        ? Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
        : 1;
    const rate = selectedRoom?.pricePerNight || homestay?.pricePerNight || 0;
    basePrice = rate * nights;
    targetTitle = `${homestay?.name || 'Homestay'} (${selectedRoom?.name || 'Room'})`;
    targetLocation = `${homestay?.city || ''}, ${homestay?.state || ''}`;
  } else if (bookingType === 'GUIDE') {
    basePrice = guide?.pricePerDay || 0;
    targetTitle = `Guided Tour with ${guide?.name || 'Local Guide'}`;
    targetLocation = guide?.destination?.name || 'Local Region';
  } else if (bookingType === 'EXPERIENCE') {
    basePrice = (experience?.price || 0) * numberOfGuests;
    targetTitle = experience?.title || 'Cultural Experience';
    targetLocation = experience?.location || 'Local Village';
  }

  const serviceFee = Math.round(basePrice * 0.05);
  const taxes = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + serviceFee + taxes;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    if (!contactName || !contactEmail || !contactPhone) {
      setErrorMsg('Please provide valid contact information.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: any = {
        bookingType,
        numberOfGuests,
        specialRequests,
        contactName,
        contactEmail,
        contactPhone,
      };

      if (bookingType === 'HOMESTAY') {
        payload.homestayId = homestayId;
        payload.roomId = selectedRoom?.id || roomId;
        payload.checkInDate = checkInDate;
        payload.checkOutDate = checkOutDate;
      } else if (bookingType === 'GUIDE') {
        payload.tourGuideId = guide?.id || tourGuideId;
        payload.startDate = startDate;
      } else if (bookingType === 'EXPERIENCE') {
        payload.experienceId = experience?.id || experienceId;
        payload.startDate = startDate;
      }

      const res = await bookingService.create(payload);
      if (res.success && res.data) {
        // Redirect to payment page
        navigate(`/payment/${res.data.id}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to initialize booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingTarget) {
    return <LoadingSpinner message="Preparing reservation details..." fullPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <Link to="/" className="hover:text-forest">Home</Link>
        <ChevronRight size={12} />
        <span>Reservation Checkout</span>
      </div>

      <div className="text-left space-y-1">
        <h1 className="text-3xl font-bold font-serif text-stone-900">Confirm & Complete Reservation</h1>
        <p className="text-xs text-stone-500">Verify your stay details and traveler contact info before proceeding to payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            {/* Booking Target Summary Box */}
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start gap-5">
              <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                <img
                  src={
                    homestay?.images?.[0]?.url ||
                    guide?.photoUrl ||
                    experience?.images?.[0] ||
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={targetTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="px-2.5 py-0.5 rounded-full bg-forest-50 text-[11px] font-bold text-forest uppercase tracking-wider">
                  {bookingType} Reservation
                </span>
                <h3 className="text-lg font-bold text-stone-900 font-serif">{targetTitle}</h3>
                <p className="text-xs text-stone-500">{targetLocation}</p>
                <div className="flex items-center gap-3 pt-1 text-xs text-stone-600 font-medium">
                  {bookingType === 'HOMESTAY' ? (
                    <span>📅 {checkInDate} → {checkOutDate}</span>
                  ) : (
                    <span>📅 Tour Date: {startDate}</span>
                  )}
                  <span>👤 {numberOfGuests} Guest{numberOfGuests > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Dates & Guests Adjustment Section */}
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-stone-900 font-serif">Trip Parameters</h3>

              {bookingType === 'HOMESTAY' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Check-In Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">Check-Out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Activity Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Number of Guests</label>
                <select
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none bg-white cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} Guest{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Primary Contact Details */}
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-stone-900 font-serif">Contact & Guest Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Lead Guest Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Phone Number (with WhatsApp)</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 9988776655"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Confirmation Email Address</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Special Dietary or Accessibility Requests (Optional)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="E.g., Vegetarian Keralite meals, ground floor room preference, or arrival around 3 PM..."
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-700">
                <AlertCircle size={18} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-forest text-white font-bold hover:bg-forest-700 transition shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating Reservation Reference...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Price Summary Box */}
        <div>
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-5 sticky top-28">
            <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">
              Price Breakdown
            </h3>

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Base Rate</span>
                <span className="font-semibold text-stone-800">{formatCurrency(basePrice)}</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  Community Platform Fee (5%)
                  <Info size={12} className="text-stone-400" />
                </span>
                <span className="font-semibold text-stone-800">{formatCurrency(serviceFee)}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & GST (12%)</span>
                <span className="font-semibold text-stone-800">{formatCurrency(taxes)}</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base font-bold text-stone-900">
                <span>Total Payable</span>
                <span className="text-xl font-bold font-serif text-forest">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-500 space-y-2">
              <div className="flex items-center gap-2 text-forest font-semibold">
                <ShieldCheck size={16} />
                <span>ExploreLocal Fair Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Your payment is held securely in escrow and disbursed directly to the local provider upon successful check-in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
