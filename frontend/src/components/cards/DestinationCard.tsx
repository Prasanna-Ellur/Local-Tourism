import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, Users, Sparkles } from 'lucide-react';
import { Destination } from '../../types';

export const DestinationCard: React.FC<{ destination: Destination }> = ({ destination }) => {
  return (
    <Link
      to={`/destinations/${destination.slug || destination.id}`}
      className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Hero Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

        {destination.isFeatured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-stone-900 shadow-md">
            <Sparkles size={12} /> Featured Destination
          </span>
        )}

        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-200 mb-1">
            <MapPin size={13} className="text-forest-300" />
            <span>{destination.state}, {destination.region}</span>
          </div>
          <h3 className="text-xl font-bold font-serif leading-tight drop-shadow-sm">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-stone-600 line-clamp-2 mb-3">
          {destination.description}
        </p>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1">
            <Home size={14} className="text-forest" />
            {destination._count?.homestays || 0} Homestays
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} className="text-forest" />
            {destination._count?.tourGuides || 0} Guides
          </span>
          <span className="text-forest font-semibold group-hover:translate-x-0.5 transition-transform">
            Explore ↗
          </span>
        </div>
      </div>
    </Link>
  );
};
