import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Activity, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  Users,
  CalendarCheck
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { TurfCard } from '../components/TurfCard';
import { turfService } from '../services/turfService';

export const Home = () => {
  const [featuredTurfs, setFeaturedTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await turfService.getTurfs({ ordering: 'featured' });
        setFeaturedTurfs(data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load featured turfs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const sports = [
    { name: 'Cricket', icon: '🏏', count: '120+ Turfs', desc: 'Box cricket & full pitches' },
    { name: 'Football', icon: '⚽', count: '95+ Turfs', desc: '5v5, 7v7 FIFA-grade turf' },
    { name: 'Box Cricket', icon: '🎯', count: '80+ Arenas', desc: 'Enclosed high-speed nets' },
    { name: 'Badminton', icon: '🏸', count: '45+ Courts', desc: 'Synthetic indoor courts' },
  ];

  const popularCities = [
    { name: 'Pune', count: '85+ Turfs', img: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mumbai', count: '140+ Turfs', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bangalore', count: '110+ Turfs', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hyderabad', count: '70+ Turfs', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative bg-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Slot Booking Across 5+ Major Cities</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Book Top Sports Turfs in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Seconds</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Discover verified cricket & football grounds near you. Compare hourly rates, check live slot availability, and book hassle-free.
          </p>

          {/* Hero Search Bar Component */}
          <div className="pt-6 max-w-4xl mx-auto">
            <SearchBar />
          </div>

          {/* Trust Metrics */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-slate-800/80 text-left">
            <div>
              <div className="text-2xl font-black text-white">500+</div>
              <div className="text-xs text-slate-400 font-medium">Verified Turfs</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">50,000+</div>
              <div className="text-xs text-slate-400 font-medium">Match Bookings</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">4.8★</div>
              <div className="text-xs text-slate-400 font-medium">User Rating</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">Zero</div>
              <div className="text-xs text-slate-400 font-medium">Double Bookings</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Sports */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">Categories</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Explore by Sport</h2>
          </div>
          <Link to="/turfs" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sports.map((sport) => (
            <Link
              key={sport.name}
              to={`/turfs?sport=${sport.name}`}
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="text-3xl mb-3">{sport.icon}</div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {sport.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{sport.desc}</p>
                <span className="inline-block mt-3 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {sport.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Turfs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">Top Rated</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Featured Sports Grounds</h2>
          </div>
          <Link to="/turfs" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
            <span>Browse All Turfs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTurfs.map((turf) => (
              <TurfCard key={turf.id} turf={turf} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Popular Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">Destinations</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Turfs in Major Cities</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularCities.map((c) => (
            <Link
              key={c.name}
              to={`/turfs?city=${c.name}`}
              className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={c.img}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-black">{c.name}</h3>
                <p className="text-xs text-emerald-400 font-medium">{c.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="bg-slate-100/80 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">Simple & Fast</span>
          <h2 className="text-3xl font-black text-slate-900">How TurfBook Works</h2>
          <p className="text-sm text-slate-500 mt-2">Book your favourite pitch in three effortless steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-lg mx-auto">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Discover Grounds</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Search by city, locality, cricket or football, budget, and amenities like floodlights and parking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-lg mx-auto">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Select Date & Slot</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick your preferred start time and duration. Real-time availability ensures you never face double bookings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-lg mx-auto">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Pay & Play</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pay securely via UPI or Card, receive instant SMS/booking confirmation, and walk onto the ground ready to play!
            </p>
          </div>
        </div>
      </section>

      {/* 6. Turf Owner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">For Ground Owners</span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              List Your Sports Turf and Maximize Your Bookings
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Manage slots, accept instant payments, block maintenance hours, and showcase your ground to thousands of sports enthusiasts in your city.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/register?role=owner"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                Register as Turf Owner
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold rounded-xl text-sm transition-colors"
              >
                Owner Login
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-base font-bold">Slot Calendar</div>
              <div className="text-xs text-slate-400">Full control over pricing & hours</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-base font-bold">Zero Hassle</div>
              <div className="text-xs text-slate-400">Automated payment settlements</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
