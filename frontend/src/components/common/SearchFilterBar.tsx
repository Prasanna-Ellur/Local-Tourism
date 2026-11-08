import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, SlidersHorizontal } from 'lucide-react';

interface SearchFilterBarProps {
  initialLocation?: string;
  initialCategory?: string;
  initialGuests?: number;
  initialDate?: string;
  onFilterChange?: (filters: any) => void;
  compact?: boolean;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  initialLocation = '',
  initialCategory = '',
  initialGuests = 1,
  initialDate = '',
  onFilterChange,
  compact = false,
}) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [guests, setGuests] = useState(initialGuests);
  const [date, setDate] = useState(initialDate);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({ location, category, guests, date });
    } else {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (category) params.append('category', category);
      if (guests > 1) params.append('guests', String(guests));
      if (date) params.append('date', date);
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white rounded-2xl md:rounded-full p-2.5 shadow-xl border border-stone-200/80 ${
        compact ? 'max-w-3xl' : 'max-w-4xl'
      } mx-auto transition-all hover:shadow-2xl`}
    >
      <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-stone-200">
        {/* Location Input */}
        <div className="flex items-center gap-3 w-full md:w-1/3 px-4 py-2.5">
          <MapPin size={20} className="text-forest shrink-0" />
          <div className="w-full text-left">
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Where to?
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Wayanad, Manali, Jaisalmer..."
              className="w-full text-sm font-semibold text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Experience Category Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-1/4 px-4 py-2.5">
          <SlidersHorizontal size={18} className="text-forest shrink-0" />
          <div className="w-full text-left">
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Experience
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="homestay">Homestays & Villas</option>
              <option value="guide">Local Tour Guides</option>
              <option value="food">Traditional Food</option>
              <option value="craft">Handicrafts & Art</option>
              <option value="heritage">Heritage & History</option>
              <option value="nature">Nature & Treks</option>
            </select>
          </div>
        </div>

        {/* Date Selection */}
        <div className="flex items-center gap-3 w-full md:w-1/4 px-4 py-2.5">
          <Calendar size={18} className="text-forest shrink-0" />
          <div className="w-full text-left">
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              When
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Guests Count & Submit */}
        <div className="flex items-center justify-between gap-3 w-full md:w-1/4 pl-4 pr-1 py-2">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-forest shrink-0" />
            <div className="text-left">
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                className="text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} Guest{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-forest text-white font-semibold hover:bg-forest-700 transition shadow-md active:scale-95 shrink-0"
          >
            <Search size={18} />
            <span className="hidden lg:inline text-xs">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};
