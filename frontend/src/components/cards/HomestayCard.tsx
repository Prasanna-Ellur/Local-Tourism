import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Heart } from 'lucide-react';
import { Homestay } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency } from '../../utils/formatters';

export const HomestayCard: React.FC<{ homestay: Homestay }> = ({ homestay }) => {
  const coverImage =
    homestay.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Container */}
      <Link to={`/homestays/${homestay.slug || homestay.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <img
          src={coverImage}
          alt={homestay.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-stone-600 hover:text-rose-500 transition shadow-sm">
          <Heart size={16} />
        </div>

        <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1">
          <MapPin size={12} className="text-forest-300" />
          <span>{homestay.city}</span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <RatingStars rating={homestay.rating} count={homestay.reviewCount} size={14} />
            <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
              <Users size={13} />
              Up to {homestay.maxGuests} guests
            </span>
          </div>

          <Link to={`/homestays/${homestay.slug || homestay.id}`}>
            <h3 className="font-bold text-base text-stone-900 group-hover:text-forest transition line-clamp-1 mb-1">
              {homestay.name}
            </h3>
          </Link>

          <p className="text-xs text-stone-500 line-clamp-2 mb-3">
            {homestay.description}
          </p>

          {/* Amenities preview tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {homestay.amenities?.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-stone-100 text-[11px] font-medium text-stone-600"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Book CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-forest">
                {formatCurrency(homestay.pricePerNight)}
              </span>
              <span className="text-xs text-stone-500">/ night</span>
            </div>
          </div>

          <Link
            to={`/homestays/${homestay.slug || homestay.id}`}
            className="px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
