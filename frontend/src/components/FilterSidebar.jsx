import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';

const CITIES = ['All Cities', 'Pune', 'Mumbai', 'Bangalore', 'Hyderabad', 'Delhi'];
const SPORTS = ['All', 'Cricket', 'Football', 'Box Cricket'];
const TURF_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'both', label: 'Both' },
];

const AMENITIES_LIST = [
  'Drinking Water',
  'Parking',
  'Washroom',
  'Changing Room',
  'Floodlights',
  'Seating Area',
  'First Aid',
  'Equipment Rental',
  'Cafeteria',
];

export const FilterSidebar = ({ filters, setFilters, onReset }) => {
  const handleAmenityToggle = (amenity) => {
    if (filters.amenity === amenity) {
      setFilters({ ...filters, amenity: '' });
    } else {
      setFilters({ ...filters, amenity });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          City
        </label>
        <select
          value={filters.city || 'All Cities'}
          onChange={(e) => setFilters({ ...filters, city: e.target.value === 'All Cities' ? '' : e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Sport */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Sport
        </label>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((sport) => {
            const isSelected = (!filters.sport && sport === 'All') || filters.sport === sport;
            return (
              <button
                key={sport}
                type="button"
                onClick={() => setFilters({ ...filters, sport: sport === 'All' ? '' : sport })}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Max Price / Hour
          </label>
          <span className="text-sm font-extrabold text-slate-900">
            ₹{filters.max_price || 3000}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="3000"
          step="100"
          value={filters.max_price || 3000}
          onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>₹500</span>
          <span>₹3,000</span>
        </div>
      </div>

      {/* Turf Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Turf Setting
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TURF_TYPES.map((type) => {
            const isSelected = (!filters.turf_type && type.value === 'all') || filters.turf_type === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setFilters({ ...filters, turf_type: type.value === 'all' ? '' : type.value })}
                className={`text-xs font-medium py-1.5 px-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Amenities
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {AMENITIES_LIST.map((amenity) => {
            const isChecked = filters.amenity === amenity;
            return (
              <label
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className="flex items-center space-x-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-1"
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
