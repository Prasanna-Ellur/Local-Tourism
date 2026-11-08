import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { CulturalExperience } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency } from '../../utils/formatters';

export const ExperienceCard: React.FC<{ experience: CulturalExperience }> = ({ experience }) => {
  const coverImage =
    experience.images?.[0] ||
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Cover Image */}
      <Link to={`/experiences#${experience.id}`} className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <img
          src={coverImage}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold">
          {experience.category}
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <RatingStars rating={experience.rating} count={experience.reviewCount} size={14} />
            <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
              <Clock size={13} /> {experience.durationHours} hrs
            </span>
          </div>

          <h3 className="font-bold text-base text-stone-900 group-hover:text-forest transition line-clamp-1 mb-1">
            {experience.title}
          </h3>

          <p className="text-xs text-stone-500 flex items-center gap-1 mb-2">
            <MapPin size={13} className="text-forest shrink-0" />
            <span className="truncate">{experience.location}</span>
          </p>

          <p className="text-xs text-stone-600 line-clamp-2">
            {experience.description}
          </p>
        </div>

        {/* Pricing and CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400">Price per person</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-forest">
                {formatCurrency(experience.price)}
              </span>
            </div>
          </div>

          <Link
            to={`/book?type=EXPERIENCE&targetId=${experience.id}`}
            className="px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-700 transition shadow-sm"
          >
            Book Experience
          </Link>
        </div>
      </div>
    </div>
  );
};
