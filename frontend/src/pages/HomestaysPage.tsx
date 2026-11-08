import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { HomestayCard } from '../components/cards/HomestayCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { homestayService } from '../services/homestayService';
import { Homestay } from '../types';

export const HomestaysPage: React.FC = () => {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [guestsFilter, setGuestsFilter] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>('rating_desc');

  const fetchHomestays = async () => {
    try {
      setLoading(true);
      const res = await homestayService.getAll({
        search: search || undefined,
        city: cityFilter || undefined,
        minPrice: minPrice !== '' ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
        guests: guestsFilter > 1 ? guestsFilter : undefined,
        sort: sortOption,
        limit: 30,
      });

      if (res.success) {
        setHomestays(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomestays();
  }, [sortOption, cityFilter, guestsFilter]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHomestays();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-forest">
          Authentic Accommodations
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
          Heritage Homestays & Eco-Villas
        </h1>
        <p className="text-sm text-stone-500">
          Experience genuine Indian hospitality with local host families in traditional homes, plantation bungalows, and timber chalets.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200/80 space-y-4">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Keyword Search */}
          <div className="relative lg:col-span-2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search homestay name, address, or features..."
              className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
            />
          </div>

          {/* City / State */}
          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none bg-white cursor-pointer"
            >
              <option value="">All Regions</option>
              <option value="Wayanad">Wayanad (Kerala)</option>
              <option value="Manali">Manali (Himachal)</option>
              <option value="Jaisalmer">Jaisalmer (Rajasthan)</option>
              <option value="Madikeri">Coorg / Madikeri</option>
            </select>
          </div>

          {/* Guests */}
          <div>
            <select
              value={guestsFilter}
              onChange={(e) => setGuestsFilter(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none bg-white cursor-pointer"
            >
              <option value={1}>1+ Guests</option>
              <option value={2}>2+ Guests</option>
              <option value={4}>4+ Guests (Family)</option>
              <option value={6}>6+ Guests (Group)</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none bg-white cursor-pointer"
            >
              <option value="rating_desc">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Listings</option>
            </select>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500">
          <span>Showing {homestays.length} authentic homestay{homestays.length === 1 ? '' : 's'}</span>
          <button
            type="button"
            onClick={fetchHomestays}
            className="text-forest hover:underline font-semibold"
          >
            Refresh listings
          </button>
        </div>
      </div>

      {/* Homestay Listings Grid */}
      {loading ? (
        <LoadingSpinner message="Finding available homestays..." fullPage />
      ) : homestays.length === 0 ? (
        <EmptyState
          title="No Homestays Match Your Filter"
          description="Try broadening your search or choosing a different region to discover available local stays."
          actionText="Reset All Filters"
          actionLink="/homestays"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homestays.map((home) => (
            <HomestayCard key={home.id} homestay={home} />
          ))}
        </div>
      )}
    </div>
  );
};
