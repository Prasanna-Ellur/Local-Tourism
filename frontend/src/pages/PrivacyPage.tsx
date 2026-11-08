import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-forest">Legal Policies</span>
        <h1 className="text-3xl font-bold font-serif text-stone-900">Privacy Policy</h1>
        <p className="text-xs text-stone-500">Effective Date: January 1, 2026</p>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/80 shadow-sm space-y-6 text-xs text-stone-600 leading-relaxed">
        <h2 className="text-base font-bold text-stone-900">1. Information We Collect</h2>
        <p>
          At ExploreLocal, we collect your name, email address, phone number, and reservation preferences when you register, book a homestay, hire a guide, or list a property. Payment transactions are processed securely via encrypted gateway tokens; we never store your credit or debit card numbers on our servers.
        </p>

        <h2 className="text-base font-bold text-stone-900">2. How We Use Your Information</h2>
        <p>
          Your information is used solely to facilitate reservations, provide host contact instructions, process payment disbursements, and communicate essential booking updates. We never sell your personal data to third-party advertising brokers.
        </p>

        <h2 className="text-base font-bold text-stone-900">3. Host and Guest Contact Sharing</h2>
        <p>
          When a reservation is confirmed and paid, we share pertinent contact details (names, phone numbers, arrival dates, dietary notes) between the host and guest to ensure a smooth check-in experience.
        </p>

        <h2 className="text-base font-bold text-stone-900">4. Data Security</h2>
        <p>
          We employ industry-standard encryption, SSL protocols, bcrypt password hashing, and role-based access control to safeguard your sensitive information.
        </p>
      </div>
    </div>
  );
};
