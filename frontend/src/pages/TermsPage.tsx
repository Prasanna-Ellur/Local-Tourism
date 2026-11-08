import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-forest">Terms of Service</span>
        <h1 className="text-3xl font-bold font-serif text-stone-900">Terms & Conditions</h1>
        <p className="text-xs text-stone-500">Last Revised: January 1, 2026</p>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/80 shadow-sm space-y-6 text-xs text-stone-600 leading-relaxed">
        <h2 className="text-base font-bold text-stone-900">1. Acceptance of Terms</h2>
        <p>
          By creating an account, browsing listings, or making a reservation on ExploreLocal, you agree to comply with these terms, our community guidelines, and regional eco-tourism standards.
        </p>

        <h2 className="text-base font-bold text-stone-900">2. Host and Service Provider Verification</h2>
        <p>
          Hosts and guides guarantee that their accommodations, tour qualifications, safety certifications, and business licenses are authentic and compliant with local municipal and state regulations.
        </p>

        <h2 className="text-base font-bold text-stone-900">3. Cancellation & Refund Policy</h2>
        <p>
          Tourists may cancel eligible pending or confirmed reservations directly from their dashboard. Cancellations made more than 48 hours prior to the check-in or tour date are eligible for a full refund minus nominal banking transaction costs. Cancellations made within 48 hours are subject to the individual host’s cancellation policies.
        </p>

        <h2 className="text-base font-bold text-stone-900">4. Community Code of Conduct</h2>
        <p>
          ExploreLocal is committed to sacred heritage preservation, non-disruptive eco-friendly travel, and respectful interactions with indigenous and tribal communities. Unruly behavior or damage to host property will result in immediate account suspension.
        </p>
      </div>
    </div>
  );
};
