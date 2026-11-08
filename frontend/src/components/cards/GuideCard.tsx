import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Languages, MapPin } from 'lucide-react';
import { TourGuide } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency } from '../../utils/formatters';

export const GuideCard: React.FC<{ guide: TourGuide }> = ({ guide }) => {
  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header Profile Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={guide.photoUrl}
          alt={guide.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
          <div>
            <h3 className="font-bold text-lg leading-tight drop-shadow-sm">{guide.name}</h3>
            {guide.destination && (
              <span className="text-xs text-stone-200 flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-forest-300" />
                {guide.destination.name}, {guide.destination.state}
              </span>
            )}
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-forest-600/90 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1">
            <Award size={12} /> {guide.yearsOfExperience} yrs exp
          </span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <RatingStars rating={guide.rating} count={guide.reviewCount} size={14} />
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 mb-3">
            {guide.bio}
          </p>

          {/* Languages */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
            <Languages size={14} className="text-forest shrink-0" />
            <span className="truncate">
              {guide.languages?.join(', ')}
            </span>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1">
            {guide.specializations?.slice(0, 2).map((spec, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-earth-50 text-[11px] font-medium text-earth-700"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400">Daily rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-forest">
                {formatCurrency(guide.pricePerDay)}
              </span>
              <span className="text-xs text-stone-500">/ day</span>
            </div>
          </div>

          <Link
            to={`/guides/${guide.id}`}
            className="px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition shadow-sm"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
