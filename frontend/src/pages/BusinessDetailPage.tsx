import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Store,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { businessService } from '../services/businessService';
import { LocalBusiness } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { RatingStars } from '../components/common/RatingStars';
import { ReviewModal } from '../components/common/ReviewModal';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

export const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [business, setBusiness] = useState<LocalBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchBusiness = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await businessService.getById(id);
      if (res.success && res.data) {
        setBusiness(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading shop details..." fullPage />;
  }

  if (!business) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold font-serif text-stone-900 mb-2">Business Not Found</h2>
        <Link to="/businesses" className="px-5 py-2.5 bg-forest text-white rounded-xl font-semibold text-sm">
          Return to Businesses
        </Link>
      </div>
    );
  }

  const images = business.images?.length > 0 ? business.images : [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <Link to="/" className="hover:text-forest">Home</Link>
        <ChevronRight size={12} />
        <Link to="/businesses" className="hover:text-forest">Local Businesses</Link>
        <ChevronRight size={12} />
        <span className="text-stone-800">{business.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-sm bg-stone-100">
            <img src={images[0]} alt={business.name} className="w-full h-full object-cover" />
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-forest-50 text-forest text-xs font-bold">
                {business.category}
              </span>
              <RatingStars rating={business.rating} count={business.reviewCount} size={16} />
            </div>

            <h1 className="text-3xl font-bold font-serif text-stone-900">{business.name}</h1>
            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {business.description}
            </p>
          </div>

          {/* Customer Reviews */}
          <section className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-serif text-stone-900">Patron Reviews</h2>
                <RatingStars rating={business.rating} count={business.reviewCount} size={15} />
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition"
                >
                  Review Shop
                </button>
              )}
            </div>

            {business.reviews && business.reviews.length > 0 ? (
              <div className="space-y-4 pt-2">
                {business.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{rev.user?.name}</span>
                      <RatingStars rating={rev.rating} size={12} showText={false} />
                    </div>
                    <p className="text-xs text-stone-600 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">No reviews yet for this business.</p>
            )}
          </section>
        </div>

        {/* Right Column: Contact & Visit Information */}
        <div>
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-6 sticky top-28">
            <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">
              Store Information
            </h3>

            <div className="space-y-4 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-forest shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-800">Address</strong>
                  <span>{business.address}</span>
                </div>
              </div>

              {business.openingHours && (
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-forest shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-800">Hours of Operation</strong>
                    <span>{business.openingHours}</span>
                  </div>
                </div>
              )}

              {business.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-forest shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-800">Telephone</strong>
                    <a href={`tel:${business.phone}`} className="text-forest hover:underline font-semibold">
                      {business.phone}
                    </a>
                  </div>
                </div>
              )}

              {business.email && (
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-forest shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-800">Email</strong>
                    <a href={`mailto:${business.email}`} className="text-forest hover:underline">
                      {business.email}
                    </a>
                  </div>
                </div>
              )}

              {business.website && (
                <div className="flex items-start gap-3">
                  <Globe size={18} className="text-forest shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-800">Website</strong>
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-forest hover:underline font-semibold">
                      Visit Storefront ↗
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-forest-50 rounded-2xl border border-forest-100 text-xs text-forest-800 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck size={15} /> Authentic Local Enterprise
              </span>
              <p className="text-[11px] text-forest-700">
                Purchasing here supports local community artisans and preserves traditional regional crafts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        targetType="BUSINESS"
        targetId={business.id}
        targetName={business.name}
        onReviewSubmitted={fetchBusiness}
      />
    </div>
  );
};
