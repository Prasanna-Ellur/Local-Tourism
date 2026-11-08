import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Heart, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top CTA Banner */}
        <div className="bg-forest-900/60 border border-forest-700/40 rounded-3xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left max-w-xl">
            <span className="text-xs uppercase tracking-widest text-forest-300 font-bold">
              Join ExploreLocal Community
            </span>
            <h3 className="text-2xl font-bold font-serif text-white mt-1">
              Are you a local host, artisan, or storyteller?
            </h3>
            <p className="text-sm text-stone-300 mt-2">
              Share your culture, home, or craft with travelers worldwide while earning sustainable livelihood in your own region.
            </p>
          </div>
          <Link
            to="/register?role=SERVICE_PROVIDER"
            className="px-6 py-3.5 rounded-2xl bg-white text-forest-900 font-bold hover:bg-cream-100 transition shadow-lg shrink-0 flex items-center gap-2 group"
          >
            Become a Provider
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-500 flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold font-serif text-white">
                Explore<span className="text-earth-300">Local</span>
              </span>
            </Link>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Empowering regional heritage, sustainable eco-homestays, indigenous guides, and grassroots cultural artisans across India. Discover authentic off-the-beaten-path living.
            </p>
            <div className="pt-2 space-y-2 text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-forest-400" />
                Bangalore & Kochi, India
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-forest-400" />
                +91 (80) 4123-5678
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-forest-400" />
                namaste@explorelocal.com
              </p>
            </div>
          </div>

          {/* Quick Discover */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Discover</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/destinations" className="hover:text-white transition">Featured Destinations</Link></li>
              <li><Link to="/homestays" className="hover:text-white transition">Heritage Homestays</Link></li>
              <li><Link to="/guides" className="hover:text-white transition">Local Naturalists & Guides</Link></li>
              <li><Link to="/experiences" className="hover:text-white transition">Cultural Experiences</Link></li>
              <li><Link to="/businesses" className="hover:text-white transition">Traditional Shops & Craft Guilds</Link></li>
            </ul>
          </div>

          {/* Top Regions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Destinations</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/destinations/wayanad" className="hover:text-white transition">Wayanad Rainforest, Kerala</Link></li>
              <li><Link to="/destinations/manali-spiti" className="hover:text-white transition">Manali & Spiti, Himachal</Link></li>
              <li><Link to="/destinations/jaisalmer" className="hover:text-white transition">Jaisalmer Living Fort, Rajasthan</Link></li>
              <li><Link to="/destinations/coorg" className="hover:text-white transition">Coorg Coffee Hills, Karnataka</Link></li>
              <li><Link to="/destinations/hampi" className="hover:text-white transition">Hampi Boulders & Ruins</Link></li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Company & Legal</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/about" className="hover:text-white transition">About Our Mission</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Support</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms & Cancellation Rules</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Partner Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} ExploreLocal Platform Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart size={13} className="text-rose-500 fill-rose-500" /> for community-led eco-tourism.
          </p>
        </div>
      </div>
    </footer>
  );
};
