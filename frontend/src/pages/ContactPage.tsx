import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-forest">
          Get in Touch
        </span>
        <h1 className="text-4xl font-bold font-serif text-stone-900">
          We’d Love to Hear From You
        </h1>
        <p className="text-sm text-stone-500 max-w-lg mx-auto">
          Whether you're a traveler planning an offbeat journey or a host seeking partner verification, our team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
          <div className="space-y-4 text-xs text-stone-600">
            <div className="space-y-1">
              <span className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                <MapPin size={16} className="text-forest" /> Headquarters
              </span>
              <p>ExploreLocal Eco-Ventures Inc.</p>
              <p>Indiranagar 100ft Road, Bangalore, Karnataka 560038</p>
            </div>

            <div className="space-y-1 pt-3 border-t border-stone-100">
              <span className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                <Phone size={16} className="text-forest" /> Phone Support
              </span>
              <p>+91 (80) 4123-5678</p>
              <p className="text-[11px] text-stone-400">Monday - Saturday (9 AM - 7 PM IST)</p>
            </div>

            <div className="space-y-1 pt-3 border-t border-stone-100">
              <span className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                <Mail size={16} className="text-forest" /> Email Support
              </span>
              <p>namaste@explorelocal.com</p>
              <p>hosts@explorelocal.com</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold font-serif text-stone-900">Message Received!</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Thank you for contacting ExploreLocal. Our community team will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Arun Verma"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="arun@example.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Inquiry about host registration or booking"
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your question or message here..."
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-forest text-white font-bold rounded-xl hover:bg-forest-700 transition shadow-sm text-xs flex items-center gap-2"
              >
                <Send size={14} />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
