import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock } from 'lucide-react';
import { LocalBusiness } from '../../types';
import { RatingStars } from '../common/RatingStars';

export const BusinessCard: React.FC<{ business: LocalBusiness }> = ({ business }) => {
  const coverImage =
    business.images?.[0] ||
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Cover Image */}
      <Link to={`/businesses/${business.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <img
          src={coverImage}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold">
          {business.category}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-stone-800 text-[11px] font-bold shadow-sm">
          {business.priceRange}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <RatingStars rating={business.rating} count={business.reviewCount} size={14} />
          </div>

          <Link to={`/businesses/${business.id}`}>
            <h3 className="font-bold text-base text-stone-900 group-hover:text-forest transition line-clamp-1 mb-1">
              {business.name}
            </h3>
          </Link>

          <p className="text-xs text-stone-500 flex items-center gap-1 mb-2">
            <MapPin size={13} className="text-forest shrink-0" />
            <span className="truncate">{business.address}</span>
          </p>

          <p className="text-xs text-stone-600 line-clamp-2">
            {business.description}
          </p>
        </div>

        {/* Operating hours & View */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="text-[11px] text-stone-500 flex items-center gap-1 truncate max-w-[170px]">
            <Clock size={12} className="text-stone-400 shrink-0" />
            <span className="truncate">{business.openingHours || 'Open today'}</span>
          </div>

          <Link
            to={`/businesses/${business.id}`}
            className="px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition shadow-sm shrink-0"
          >
            Visit Shop
          </Link>
        </div>
      </div>
    </div>
  );
};
