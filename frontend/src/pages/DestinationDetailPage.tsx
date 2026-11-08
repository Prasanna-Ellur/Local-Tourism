import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Compass,
  Home,
  Users,
  Sparkles,
  ShoppingBag,
  Bus,
  CheckCircle2,
} from 'lucide-react';
import { destinationService } from '../services/destinationService';
import { Destination } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { HomestayCard } from '../components/cards/HomestayCard';
import { GuideCard } from '../components/cards/GuideCard';
import { ExperienceCard } from '../components/cards/ExperienceCard';
import { BusinessCard } from '../components/cards/BusinessCard';
import { OpenStreetMap } from '../components/common/OpenStreetMap';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'HOMESTAYS' | 'GUIDES' | 'EXPERIENCES' | 'BUSINESSES'>('HOMESTAYS');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await destinationService.getById(id);
        if (res.success && res.data) {
          setDestination(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading destination details..." fullPage />;
  }

  if (!destination) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold font-serif text-stone-900 mb-2">Destination Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">The destination you requested does not exist or may have been unlisted.</p>
        <Link to="/destinations" className="px-5 py-2.5 bg-forest text-white rounded-xl font-semibold text-sm">
          Return to Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner */}
      <div className="relative h-[480px] w-full overflow-hidden bg-stone-900">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-600/90 text-xs font-semibold mb-3">
            <MapPin size={13} className="text-emerald-300" />
            <span>{destination.state}, {destination.region}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-serif mb-3 drop-shadow-md">
            {destination.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-200">
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              <Calendar size={13} className="text-amber-300" />
              Best time: {destination.bestTimeToVisit}
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              <Home size={13} className="text-emerald-300" />
              {destination.homestays?.length || 0} Homestays
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              <Users size={13} className="text-sky-300" />
              {destination.tourGuides?.length || 0} Local Guides
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Description & Attractions */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold font-serif text-stone-900">About {destination.name}</h2>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>

              {/* Popular Attractions */}
              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Top Regional Highlights & Attractions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {destination.attractions?.map((attr, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-50 text-xs font-semibold text-forest-800 border border-forest-100"
                    >
                      <CheckCircle2 size={13} className="text-forest" />
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Travel and Transit info */}
            <section className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-forest">
                <Bus size={20} />
                <h3 className="text-lg font-bold font-serif text-stone-900">How to Reach & Travel Logistics</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {destination.travelInfo}
              </p>
            </section>

            {/* Image Gallery */}
            {destination.images && destination.images.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-bold font-serif text-stone-900">Destination Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {destination.images.map((img, i) => (
                    <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-stone-100">
                      <img src={img} alt={`${destination.name} photo ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: OpenStreetMap & Quick Info */}
          <div className="space-y-6">
            <OpenStreetMap
              latitude={destination.latitude}
              longitude={destination.longitude}
              title={destination.name}
            />

            <div className="bg-forest-50 p-6 rounded-3xl border border-forest-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800">
                Eco-Tourism Pledge
              </h4>
              <p className="text-xs text-forest-700 leading-relaxed">
                When visiting {destination.name}, remember to carry a reusable water container, refrain from littering, respect sacred tribal shrines, and hire licensed local guides.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION: Local Services in Destination (Tabs) */}
        <div className="mt-16 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-forest">
                Community Stays & Experiences
              </span>
              <h2 className="text-2xl font-bold font-serif text-stone-900 mt-1">
                Explore in {destination.name}
              </h2>
            </div>

            {/* Tabs Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl shrink-0">
              <button
                onClick={() => setActiveTab('HOMESTAYS')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'HOMESTAYS' ? 'bg-white text-forest shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Homestays ({destination.homestays?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('GUIDES')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'GUIDES' ? 'bg-white text-forest shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Guides ({destination.tourGuides?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('EXPERIENCES')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'EXPERIENCES' ? 'bg-white text-forest shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Experiences ({destination.culturalExperiences?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('BUSINESSES')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'BUSINESSES' ? 'bg-white text-forest shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Shops ({destination.localBusinesses?.length || 0})
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'HOMESTAYS' && (
            destination.homestays && destination.homestays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destination.homestays.map((h) => (
                  <HomestayCard key={h.id} homestay={h} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-8 text-center">No homestay listings yet in {destination.name}.</p>
            )
          )}

          {activeTab === 'GUIDES' && (
            destination.tourGuides && destination.tourGuides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destination.tourGuides.map((g) => (
                  <GuideCard key={g.id} guide={g} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-8 text-center">No tour guides registered yet in {destination.name}.</p>
            )
          )}

          {activeTab === 'EXPERIENCES' && (
            destination.culturalExperiences && destination.culturalExperiences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destination.culturalExperiences.map((e) => (
                  <ExperienceCard key={e.id} experience={e} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-8 text-center">No experiences currently scheduled in {destination.name}.</p>
            )
          )}

          {activeTab === 'BUSINESSES' && (
            destination.localBusinesses && destination.localBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destination.localBusinesses.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-8 text-center">No local shops listed yet in {destination.name}.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};
