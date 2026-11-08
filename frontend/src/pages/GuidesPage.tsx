import React, { useState, useEffect } from 'react';
import { Search, Compass, Award, Languages } from 'lucide-react';
import { GuideCard } from '../components/cards/GuideCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { guideService } from '../services/guideService';
import { TourGuide } from '../types';

export const GuidesPage: React.FC = () => {
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await guideService.getAll({
        search: search || undefined,
        language: languageFilter || undefined,
        limit: 30,
      });
      if (res.success) {
        setGuides(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [languageFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGuides();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-forest">
          Local Storytellers & Historians
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
          Certified Regional Tour Guides
        </h1>
        <p className="text-sm text-stone-500">
          Explore off-the-beaten-path trails, UNESCO heritage architecture, and sacred folklore led by native resident naturalists.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200/80 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guide name, wildlife, trekking, or history..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </form>

        <div className="w-full sm:w-48">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest cursor-pointer"
          >
            <option value="">All Spoken Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Tibetan">Tibetan</option>
            <option value="Marwari">Marwari</option>
            <option value="Kannada">Kannada</option>
          </select>
        </div>

        <button
          type="button"
          onClick={fetchGuides}
          className="w-full sm:w-auto px-5 py-2.5 bg-forest text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition shrink-0"
        >
          Search Guides
        </button>
      </div>

      {/* Guides Grid */}
      {loading ? (
        <LoadingSpinner message="Locating local guides..." fullPage />
      ) : guides.length === 0 ? (
        <EmptyState
          title="No Tour Guides Found"
          description="We couldn't find any guides matching your criteria. Try resetting the filters to explore all guides."
          actionText="Clear Filters"
          actionLink="/guides"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </div>
  );
};
