import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { DestinationCard } from '../components/cards/DestinationCard';
import { HomestayCard } from '../components/cards/HomestayCard';
import { GuideCard } from '../components/cards/GuideCard';
import { ExperienceCard } from '../components/cards/ExperienceCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { destinationService } from '../services/destinationService';
import { homestayService } from '../services/homestayService';
import { guideService } from '../services/guideService';
import { experienceService } from '../services/experienceService';
import { Destination, Homestay, TourGuide, CulturalExperience } from '../types';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const locationParam = searchParams.get('location') || '';
  const categoryParam = searchParams.get('category') || '';
  const guestsParam = searchParams.get('guests') || '1';

  const [location, setLocation] = useState(locationParam);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const executeSearch = async () => {
    try {
      setLoading(true);

      const [destRes, homeRes, guideRes, expRes] = await Promise.all([
        destinationService.getAll({ search: location || undefined }),
        homestayService.getAll({
          search: location || undefined,
          guests: parseInt(guestsParam, 10) || undefined,
          minRating: minRating > 0 ? minRating : undefined,
          maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
        }),
        guideService.getAll({ search: location || undefined }),
        experienceService.getAll({ search: location || undefined }),
      ]);

      if (destRes.success) setDestinations(destRes.data);
      if (homeRes.success) setHomestays(homeRes.data);
      if (guideRes.success) setGuides(guideRes.data);
      if (expRes.success) setExperiences(expRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLocation(locationParam);
    setActiveCategory(categoryParam || 'all');
    executeSearch();
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (activeCategory && activeCategory !== 'all') params.append('category', activeCategory);
    setSearchParams(params);
  };

  const totalResults =
    (activeCategory === 'all' || activeCategory === 'destinations' ? destinations.length : 0) +
    (activeCategory === 'all' || activeCategory === 'homestay' ? homestays.length : 0) +
    (activeCategory === 'all' || activeCategory === 'guide' ? guides.length : 0) +
    (activeCategory === 'all' || activeCategory === 'experience' ? experiences.length : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header and Bar */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search location, destination, or activity..."
              className="w-full pl-10 pr-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-forest text-white font-semibold hover:bg-forest-700 transition text-sm"
          >
            Update Search
          </button>
        </form>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'destinations', label: `Destinations (${destinations.length})` },
            { id: 'homestay', label: `Homestays (${homestays.length})` },
            { id: 'guide', label: `Tour Guides (${guides.length})` },
            { id: 'experience', label: `Cultural Experiences (${experiences.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeCategory === tab.id
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
        <p>
          Found <strong className="text-stone-900">{totalResults}</strong> result{totalResults === 1 ? '' : 's'}
          {locationParam && <> for "<strong className="text-forest">{locationParam}</strong>"</>}
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Searching verified local listings..." fullPage />
      ) : totalResults === 0 ? (
        <EmptyState
          title="No Results Matching Search"
          description={`We couldn't find matches for "${locationParam}". Try searching for popular regions like Wayanad, Manali, Jaisalmer, or Coorg.`}
          actionText="Browse Destinations"
          actionLink="/destinations"
        />
      ) : (
        <div className="space-y-12">
          {/* Destinations Category */}
          {(activeCategory === 'all' || activeCategory === 'destinations') && destinations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-stone-900">Destinations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinations.map((d) => (
                  <DestinationCard key={d.id} destination={d} />
                ))}
              </div>
            </div>
          )}

          {/* Homestays Category */}
          {(activeCategory === 'all' || activeCategory === 'homestay') && homestays.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-stone-900">Homestays & Accommodations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {homestays.map((h) => (
                  <HomestayCard key={h.id} homestay={h} />
                ))}
              </div>
            </div>
          )}

          {/* Guides Category */}
          {(activeCategory === 'all' || activeCategory === 'guide') && guides.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-stone-900">Local Tour Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {guides.map((g) => (
                  <GuideCard key={g.id} guide={g} />
                ))}
              </div>
            </div>
          )}

          {/* Experiences Category */}
          {(activeCategory === 'all' || activeCategory === 'experience') && experiences.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-stone-900">Cultural Experiences</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {experiences.map((e) => (
                  <ExperienceCard key={e.id} experience={e} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
