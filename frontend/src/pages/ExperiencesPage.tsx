import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import { ExperienceCard } from '../components/cards/ExperienceCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { experienceService } from '../services/experienceService';
import { CulturalExperience } from '../types';

export const ExperiencesPage: React.FC = () => {
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    'All Categories',
    'Traditional Food',
    'Village Tour',
    'Handicrafts',
    'Heritage',
    'Nature & Trekking',
  ];

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await experienceService.getAll({
        search: search || undefined,
        category: categoryFilter && categoryFilter !== 'All Categories' ? categoryFilter : undefined,
        limit: 30,
      });
      if (res.success) {
        setExperiences(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExperiences();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-forest">
          Living Cultural Heritage
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
          Immersive Cultural Experiences
        </h1>
        <p className="text-sm text-stone-500">
          Learn ancestral recipes, join organic spice harvests, listen to fireside folk balladeers, and craft terracotta pottery with resident masters.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiences by title, village, or ingredients..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-forest focus:outline-none shadow-sm"
          />
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat === 'All Categories' ? '' : cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                (categoryFilter === '' && cat === 'All Categories') || categoryFilter === cat
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner message="Curating cultural experiences..." fullPage />
      ) : experiences.length === 0 ? (
        <EmptyState
          title="No Experiences Found"
          description="We couldn't locate any cultural activities matching your filter. Try choosing another category."
          actionText="View All Experiences"
          actionLink="/experiences"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      )}
    </div>
  );
};
