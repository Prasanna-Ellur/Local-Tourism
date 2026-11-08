import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { DestinationCard } from '../components/cards/DestinationCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { destinationService } from '../services/destinationService';
import { Destination } from '../types';

export const DestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await destinationService.getAll({
        search: search || undefined,
        state: stateFilter || undefined,
        limit: 20,
      });
      if (res.success) {
        setDestinations(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [stateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDestinations();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-forest">
          Explore Regions
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
          Regional Tourist Destinations
        </h1>
        <p className="text-sm text-stone-500">
          Discover hidden valleys, coastal fishing hamlets, coffee-cloaked hill stations, and desert fortresses across India.
        </p>
      </div>

      {/* Search and State Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200/80 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination name, region, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </form>

        <div className="w-full sm:w-48">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest cursor-pointer"
          >
            <option value="">All States</option>
            <option value="Kerala">Kerala</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Assam">Assam</option>
          </select>
        </div>

        <button
          type="button"
          onClick={fetchDestinations}
          className="w-full sm:w-auto px-5 py-2.5 bg-forest text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition shrink-0"
        >
          Filter
        </button>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching regional destinations..." fullPage />
      ) : destinations.length === 0 ? (
        <EmptyState
          title="No Destinations Found"
          description="We couldn't find any destinations matching your search criteria. Try removing filters or searching for another region."
          actionText="Clear Filters"
          actionLink="/destinations"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
};
