import React from 'react';
import { Compass, Heart, ShieldCheck, Trees, Users, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-forest">
          Our Story & Philosophy
        </span>
        <h1 className="text-4xl font-bold font-serif text-stone-900">
          About ExploreLocal
        </h1>
        <p className="text-base text-stone-500 max-w-2xl mx-auto leading-relaxed">
          We believe travel should enrich host communities directly, preserve sacred ecosystems, and foster deep human connections beyond commercial tourism.
        </p>
      </div>

      <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-lg bg-stone-900">
        <img
          src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1400&q=80"
          alt="Local Kerala host family and misty mountains"
          className="w-full h-full object-cover brightness-[0.75]"
        />
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/80 shadow-sm space-y-6 text-sm text-stone-600 leading-relaxed">
        <h2 className="text-2xl font-bold font-serif text-stone-900">
          Reimagining Indian Tourism from the Roots
        </h2>
        <p>
          Founded in 2026, ExploreLocal emerged from a simple observation: conventional tourism often bypasses the very families, tribal communities, and local storytellers who preserve India’s vast cultural landscapes. Giant corporate aggregators extract high commission fees while leaving regional economies vulnerable.
        </p>
        <p>
          ExploreLocal is designed differently. We provide transparent, community-led infrastructure that allows homestay owners, licensed naturalists, indigenous artisans, and family-run traditional businesses to reach travelers directly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-100">
          <div className="space-y-2">
            <span className="text-3xl font-bold font-serif text-forest">95%</span>
            <p className="text-xs text-stone-500 font-semibold">Of every booking goes straight to local hosts</p>
          </div>
          <div className="space-y-2">
            <span className="text-3xl font-bold font-serif text-forest">100%</span>
            <p className="text-xs text-stone-500 font-semibold">Verified grassroots listings and authentic homestays</p>
          </div>
          <div className="space-y-2">
            <span className="text-3xl font-bold font-serif text-forest">Zero</span>
            <p className="text-xs text-stone-500 font-semibold">Mass-commercial cookie-cutter resort packages</p>
          </div>
        </div>
      </div>
    </div>
  );
};
