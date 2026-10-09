import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center">
                <span className="text-lg font-black text-slate-950">TB</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Turf<span className="text-emerald-400">Book</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              India's premier sports ground and turf discovery platform. Compare, book, and play cricket and football at top-rated facilities near you.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Grounds & Secure Slots</span>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Popular Cities
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/turfs?city=Pune" className="hover:text-emerald-400 transition-colors">
                  Turfs in Pune (Kothrud, Baner, Viman Nagar)
                </Link>
              </li>
              <li>
                <Link to="/turfs?city=Mumbai" className="hover:text-emerald-400 transition-colors">
                  Turfs in Mumbai (Bandra, Andheri, Powai)
                </Link>
              </li>
              <li>
                <Link to="/turfs?city=Bangalore" className="hover:text-emerald-400 transition-colors">
                  Turfs in Bangalore (Koramangala, Indiranagar)
                </Link>
              </li>
              <li>
                <Link to="/turfs?city=Hyderabad" className="hover:text-emerald-400 transition-colors">
                  Turfs in Hyderabad (Gachibowli, Hitec City)
                </Link>
              </li>
            </ul>
          </div>

          {/* Sports Categories & Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/turfs?sport=Cricket" className="hover:text-emerald-400 transition-colors">
                  Cricket & Box Cricket Grounds
                </Link>
              </li>
              <li>
                <Link to="/turfs?sport=Football" className="hover:text-emerald-400 transition-colors">
                  Football & Futsal Turfs
                </Link>
              </li>
              <li>
                <Link to="/register?role=owner" className="hover:text-emerald-400 transition-colors">
                  Register as Turf Owner
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-emerald-400 transition-colors">
                  Manage My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Get in Touch
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Pune / Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 98220 12345</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>support@turfbook.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TurfBook. MCA Full-Stack Project. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-4 md:mt-0">
            <span>Built with React, Django & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
