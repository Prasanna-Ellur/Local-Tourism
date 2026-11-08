import React, { useState, useEffect } from 'react';
import { Search, Store, ShoppingBag } from 'lucide-react';
import { BusinessCard } from '../components/cards/BusinessCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { businessService } from '../services/businessService';
import { LocalBusiness } from '../types';

export const BusinessesPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<LocalBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await businessService.getAll({
        search: search || undefined,
        limit: 30,
      });
      if (res.success) {
        setBusinesses(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBusinesses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-forest">
          Grassroots Regional Commerce
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
          Traditional Shops & Artisan Guilds
        </h1>
        <p className="text-sm text-stone-500">
          Buy directly from source farmer cooperatives, handloom pit-weavers, bell metal craftsmen, and family spice merchants.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spices, woolens, camel leather, or tea depot..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-forest focus:outline-none shadow-sm"
          />
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner message="Loading local artisans and businesses..." fullPage />
      ) : businesses.length === 0 ? (
        <EmptyState
          title="No Businesses Found"
          description="We couldn't find any regional businesses matching your query."
          actionText="Clear Search"
          actionLink="/businesses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}
        </div>
      )}
    </div>
  );
};
