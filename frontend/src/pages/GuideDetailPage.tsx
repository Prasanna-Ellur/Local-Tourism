import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Award,
  Languages,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { guideService } from '../services/guideService';
import { TourGuide } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { RatingStars } from '../components/common/RatingStars';
import { ReviewModal } from '../components/common/ReviewModal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

export const GuideDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [guide, setGuide] = useState<TourGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [durationDays, setDurationDays] = useState<number>(1);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  const fetchGuide = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await guideService.getById(id);
      if (res.success && res.data) {
        setGuide(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuide();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading guide profile..." fullPage />;
  }

  if (!guide) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold font-serif text-stone-900 mb-2">Guide Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">The tour guide you requested does not exist.</p>
        <Link to="/guides" className="px-5 py-2.5 bg-forest text-white rounded-xl font-semibold text-sm">
          Return to Guides
        </Link>
      </div>
    );
  }

  const basePrice = guide.pricePerDay * durationDays;
  const serviceFee = Math.round(basePrice * 0.05);
  const taxes = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + serviceFee + taxes;

  const handleBookGuide = () => {
    const query = new URLSearchParams({
      type: 'GUIDE',
      tourGuideId: guide.id,
      startDate: selectedDate,
      guests: String(numberOfGuests),
    });
    navigate(`/book?${query.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <Link to="/" className="hover:text-forest">Home</Link>
        <ChevronRight size={12} />
        <Link to="/guides" className="hover:text-forest">Tour Guides</Link>
        <ChevronRight size={12} />
        <span className="text-stone-800">{guide.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Profile Bio & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={guide.photoUrl}
              alt={guide.name}
              className="w-32 h-32 rounded-3xl object-cover shadow-md border-2 border-forest"
            />
            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-forest-50 text-forest text-xs font-bold flex items-center gap-1 border border-forest-100">
                  <ShieldCheck size={14} /> Verified Naturalist
                </span>
                <span className="px-3 py-1 rounded-full bg-earth-50 text-earth-700 text-xs font-bold flex items-center gap-1">
                  <Award size={14} /> {guide.yearsOfExperience} Years Experience
                </span>
              </div>

              <h1 className="text-3xl font-bold font-serif text-stone-900">{guide.name}</h1>

              {guide.destination && (
                <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-1 font-medium">
                  <MapPin size={14} className="text-forest" />
                  <span>{guide.destination.name}, {guide.destination.state}</span>
                </p>
              )}

              <div className="pt-2">
                <RatingStars rating={guide.rating} count={guide.reviewCount} size={16} />
              </div>
            </div>
          </div>

          {/* Bio Description */}
          <section className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold font-serif text-stone-900">About {guide.name}</h2>
            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {guide.bio}
            </p>
          </section>

          {/* Languages & Specializations */}
          <section className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                <Languages size={15} className="text-forest" />
                Spoken Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {guide.languages?.map((lang, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-stone-100 text-xs font-semibold text-stone-700">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                <Award size={15} className="text-forest" />
                Areas of Expertise & Guiding Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {guide.specializations?.map((spec, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-forest-50 text-xs font-semibold text-forest-800 border border-forest-100">
                    ✓ {spec}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-serif text-stone-900">Traveler Reviews</h2>
                <RatingStars rating={guide.rating} count={guide.reviewCount} size={15} />
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition"
                >
                  Review Guide
                </button>
              )}
            </div>

            {guide.reviews && guide.reviews.length > 0 ? (
              <div className="space-y-4 pt-2">
                {guide.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-forest text-white font-bold flex items-center justify-center text-xs">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-bold text-stone-900">{rev.user?.name}</span>
                      </div>
                      <RatingStars rating={rev.rating} size={12} showText={false} />
                    </div>
                    <p className="text-xs text-stone-600 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">No reviews yet for this guide.</p>
            )}
          </section>
        </div>

        {/* Right Column: Booking Box */}
        <div>
          <div className="sticky top-28 bg-white p-6 rounded-3xl border border-stone-200 shadow-xl space-y-5">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-xs text-stone-400">Guiding Rate</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-bold font-serif text-forest">
                  {formatCurrency(guide.pricePerDay)}
                </span>
                <span className="text-xs text-stone-500">/ full day</span>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Tour Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none bg-stone-50 cursor-pointer font-semibold"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Duration</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none bg-white cursor-pointer"
              >
                <option value={1}>1 Full Day Tour (7-8 hours)</option>
                <option value={2}>2 Days Expedition</option>
                <option value={3}>3 Days Multi-trail Journey</option>
                <option value={5}>5 Days Complete Region Immersion</option>
              </select>
            </div>

            {/* Number of guests */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Number in Group</label>
              <select
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none bg-white cursor-pointer"
              >
                {[1, 2, 3, 4, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} Traveler{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Cost breakdown */}
            <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{formatCurrency(guide.pricePerDay)} × {durationDays} day{durationDays > 1 ? 's' : ''}</span>
                <span className="font-semibold">{formatCurrency(basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Service Fee (5%)</span>
                <span>{formatCurrency(serviceFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Insurance (12%)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-forest text-base">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={handleBookGuide}
              className="w-full py-3.5 px-4 rounded-xl bg-forest text-white font-bold hover:bg-forest-700 transition shadow-md text-sm"
            >
              Book Guide Service
            </button>

            <p className="text-[11px] text-stone-400 text-center">
              Direct connection with guide. Free cancellation up to 48 hours in advance.
            </p>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        targetType="GUIDE"
        targetId={guide.id}
        targetName={`Tour Guide ${guide.name}`}
        onReviewSubmitted={fetchGuide}
      />
    </div>
  );
};
