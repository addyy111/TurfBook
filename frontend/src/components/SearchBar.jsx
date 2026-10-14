import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Trophy, ArrowRight } from 'lucide-react';

const CITIES = ['All Cities', 'Pune', 'Mumbai', 'Bangalore', 'Hyderabad', 'Delhi'];
const SPORTS = ['All Sports', 'Cricket', 'Football', 'Box Cricket'];

export const SearchBar = ({ initialCity = '', initialSport = '', initialQuery = '', className = '' }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState(initialCity || 'All Cities');
  const [sport, setSport] = useState(initialSport || 'All Sports');
  const [query, setQuery] = useState(initialQuery || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city && city !== 'All Cities') params.append('city', city);
    if (sport && sport !== 'All Sports') params.append('sport', sport);
    if (query.trim()) params.append('search', query.trim());

    navigate(`/turfs?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-3 ${className}`}
    >
      {/* City Input */}
      <div className="flex items-center w-full md:w-1/4 px-3 py-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-colors border border-slate-200/60">
        <MapPin className="w-5 h-5 text-emerald-500 mr-2.5 flex-shrink-0" />
        <div className="flex flex-col w-full">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sport Input */}
      <div className="flex items-center w-full md:w-1/4 px-3 py-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-colors border border-slate-200/60">
        <Trophy className="w-5 h-5 text-emerald-500 mr-2.5 flex-shrink-0" />
        <div className="flex flex-col w-full">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sport</span>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            {SPORTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Locality or Turf Name Search */}
      <div className="flex items-center w-full md:flex-1 px-3 py-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-colors border border-slate-200/60">
        <Search className="w-5 h-5 text-slate-400 mr-2.5 flex-shrink-0" />
        <div className="flex flex-col w-full">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Turf / Area</span>
          <input
            type="text"
            placeholder="e.g. Kothrud, Bandra, Arena..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-800 focus:outline-none placeholder-slate-400"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full md:w-auto h-14 px-7 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex-shrink-0 cursor-pointer"
      >
        <span>Find Turfs</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};
