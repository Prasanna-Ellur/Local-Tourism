import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Trees,
  Award,
  ArrowRight,
  Quote,
  Star,
} from 'lucide-react';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { DestinationCard } from '../components/cards/DestinationCard';
import { HomestayCard } from '../components/cards/HomestayCard';
import { GuideCard } from '../components/cards/GuideCard';
import { ExperienceCard } from '../components/cards/ExperienceCard';
import { BusinessCard } from '../components/cards/BusinessCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { destinationService } from '../services/destinationService';
import { homestayService } from '../services/homestayService';
import { guideService } from '../services/guideService';
import { experienceService } from '../services/experienceService';
import { businessService } from '../services/businessService';
import { Destination, Homestay, TourGuide, CulturalExperience, LocalBusiness } from '../types';

export const HomePage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [businesses, setBusinesses] = useState<LocalBusiness[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setLoading(true);
        const [destRes, homeRes, guideRes, expRes, bizRes] = await Promise.all([
          destinationService.getAll({ limit: 4, featured: true }),
          homestayService.getAll({ limit: 3, sort: 'rating_desc' }),
          guideService.getAll({ limit: 3 }),
          experienceService.getAll({ limit: 3 }),
          businessService.getAll({ limit: 3, featured: true }),
        ]);

        if (destRes.success) setDestinations(destRes.data);
        if (homeRes.success) setHomestays(homeRes.data);
        if (guideRes.success) setGuides(guideRes.data);
        if (expRes.success) setExperiences(expRes.data);
        if (bizRes.success) setBusinesses(bizRes.data);
      } catch (err) {
        console.error('Error fetching homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[640px] flex items-center justify-center pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=80"
            alt="Misty tea gardens and Western Ghats mountains"
            className="w-full h-full object-cover brightness-[0.65] scale-105 transform animate-pulse duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-900/40 to-[#fdfbf7]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-600/80 backdrop-blur-md text-emerald-200 text-xs font-semibold tracking-wider uppercase shadow-lg border border-emerald-400/30">
            <Sparkles size={14} className="text-amber-300" />
            Authentic Regional Tourism & Living
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif text-white tracking-tight leading-[1.1] drop-shadow-md">
            Discover Hidden Gems.{' '}
            <span className="text-amber-200 block sm:inline">Experience Local Culture.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-200 font-medium leading-relaxed drop-shadow-sm">
            Connect directly with verified local hosts, indigenous tour guides, traditional artisans, and regional homestays. Travel sustainably and immerse yourself in genuine community stories.
          </p>

          {/* Search Filter Bar */}
          <div className="pt-4">
            <SearchFilterBar />
          </div>

          {/* Quick Category Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold text-stone-200">
            <span className="text-stone-400">Popular searches:</span>
            {['Wayanad Rainforest', 'Old Manali Wood Cabins', 'Thar Desert Camel Safari', 'Coorg Coffee Estates'].map((tag) => (
              <Link
                key={tag}
                to={`/search?location=${encodeURIComponent(tag.split(' ')[0])}`}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FEATURED DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest">
              Handpicked Regions
            </span>
            <h2 className="text-3xl font-bold font-serif text-stone-900 mt-1">
              Featured Regional Destinations
            </h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              From misty Southern Western Ghats to trans-Himalayan high valleys and Thar golden desert ramparts.
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:text-forest-700 mt-4 md:mt-0 transition group"
          >
            Browse All Destinations
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading destinations..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* 3. POPULAR HOMESTAYS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest">
              Stay Like a Local
            </span>
            <h2 className="text-3xl font-bold font-serif text-stone-900 mt-1">
              Authentic Homestays & Heritage Villas
            </h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              Handpicked family-run ancestral mansions, tea plantation cottages, and eco-retreats with homecooked meals.
            </p>
          </div>
          <Link
            to="/homestays"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:text-forest-700 mt-4 md:mt-0 transition group"
          >
            View All Homestays
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading homestays..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homestays.map((home) => (
              <HomestayCard key={home.id} homestay={home} />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE EXPLORELOCAL */}
      <section className="bg-forest-900 text-stone-200 py-20 border-y border-forest-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">
              Sustainable & Ethical Tourism
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
              Why Choose ExploreLocal?
            </h2>
            <p className="text-sm text-stone-300">
              We eliminate commercial middlemen to connect you directly with genuine regional stewards and custodians of Indian heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-3xl bg-forest-800/60 border border-forest-700/50 space-y-3 hover:bg-forest-800 transition">
              <div className="w-12 h-12 rounded-2xl bg-forest-700 text-emerald-300 flex items-center justify-center font-bold">
                <HeartHandshake size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Direct Local Income</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                95% of every booking goes directly to your homestay family, mountain guide, or village artisan guild.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-forest-800/60 border border-forest-700/50 space-y-3 hover:bg-forest-800 transition">
              <div className="w-12 h-12 rounded-2xl bg-forest-700 text-emerald-300 flex items-center justify-center font-bold">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Verified Hosts & Guides</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Every service provider is manually vetted for safety, regional knowledge, and genuine heritage authenticity.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-forest-800/60 border border-forest-700/50 space-y-3 hover:bg-forest-800 transition">
              <div className="w-12 h-12 rounded-2xl bg-forest-700 text-emerald-300 flex items-center justify-center font-bold">
                <Trees size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Eco & Cultural Respect</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                We promote plastic-free stays, organic farm-to-table culinary traditions, and sacred indigenous heritage preservation.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-forest-800/60 border border-forest-700/50 space-y-3 hover:bg-forest-800 transition">
              <div className="w-12 h-12 rounded-2xl bg-forest-700 text-emerald-300 flex items-center justify-center font-bold">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Guaranteed Availability</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Real-time calendar verification prevents double-bookings with transparent cancellation protections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CULTURAL EXPERIENCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest">
              Living Traditions
            </span>
            <h2 className="text-3xl font-bold font-serif text-stone-900 mt-1">
              Immersive Cultural Experiences
            </h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              Don't just observe from afar. Learn claypot cooking, carve cedar wood, and listen to desert folk fireside balladeers.
            </p>
          </div>
          <Link
            to="/experiences"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:text-forest-700 mt-4 md:mt-0 transition group"
          >
            Explore All Experiences
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading cultural experiences..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </section>

      {/* 6. RECOMMENDED LOCAL TOUR GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest">
              Storytellers & Naturalists
            </span>
            <h2 className="text-3xl font-bold font-serif text-stone-900 mt-1">
              Recommended Local Guides
            </h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              Passionate native historians and licensed wilderness guides who know every hidden temple trail and bird call.
            </p>
          </div>
          <Link
            to="/guides"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:text-forest-700 mt-4 md:mt-0 transition group"
          >
            Find a Tour Guide
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading guides..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
        )}
      </section>

      {/* 7. FEATURED LOCAL BUSINESSES & ARTISANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest">
              Grassroots Commerce
            </span>
            <h2 className="text-3xl font-bold font-serif text-stone-900 mt-1">
              Featured Regional Businesses & Cooperatives
            </h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              Support organic spice cooperatives, loom weaver guilds, and family-owned heritage workshops.
            </p>
          </div>
          <Link
            to="/businesses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:text-forest-700 mt-4 md:mt-0 transition group"
          >
            Discover All Businesses
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading local businesses..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        )}
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#ede8dc]/50 rounded-3xl p-10 md:p-16 border border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest text-forest font-bold">
              Traveler Stories
            </span>
            <h2 className="text-3xl font-bold font-serif text-stone-900">
              Memories Made With ExploreLocal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/60 flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-forest-300 mb-3" />
                <p className="text-xs text-stone-600 leading-relaxed italic mb-4">
                  "Staying at Vythiri Mist was the antithesis of a crowded resort. We drank coffee picked from the trees outside our window and listened to hornbills each dawn. Truly restorative."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                  alt="Ananya Sharma"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Ananya Sharma</h4>
                  <p className="text-[11px] text-stone-500">Travel Photographer, Mumbai</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/60 flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-forest-300 mb-3" />
                <p className="text-xs text-stone-600 leading-relaxed italic mb-4">
                  "Our guide Tenzin in Manali took us to remote Kath Kuni temples tourists never reach. He explained Tibetan monastery frescoes in fascinating detail. Best guide booking experience!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Rahul Nair"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Rahul Nair</h4>
                  <p className="text-[11px] text-stone-500">Architect, Bangalore</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/60 flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-forest-300 mb-3" />
                <p className="text-xs text-stone-600 leading-relaxed italic mb-4">
                  "The sunset dunes folk concert in Jaisalmer was magical. Genuine Manganiyar musicians playing under a canopy of Thar desert stars with hot dal baati churma made by host Rana."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80"
                  alt="Arun Verma"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Arun Verma</h4>
                  <p className="text-[11px] text-stone-500">Slow Traveler, New Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
