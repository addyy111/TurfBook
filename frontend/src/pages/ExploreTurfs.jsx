import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TurfCard } from '../components/TurfCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { turfService } from '../services/turfService';
import { Search, SlidersHorizontal, Loader2, Frown } from 'lucide-react';

export const ExploreTurfs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state initialized from query params
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    sport: searchParams.get('sport') || '',
    search: searchParams.get('search') || '',
    max_price: searchParams.get('max_price') || '3000',
    turf_type: searchParams.get('turf_type') || '',
    amenity: searchParams.get('amenity') || '',
    ordering: searchParams.get('ordering') || 'featured',
  });

  // Sync state when URL params change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      city: searchParams.get('city') || '',
      sport: searchParams.get('sport') || '',
      search: searchParams.get('search') || '',
    }));
  }, [searchParams]);

  // Fetch turfs whenever filters change
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.city) params.city = filters.city;
        if (filters.sport) params.sport = filters.sport;
        if (filters.search) params.search = filters.search;
        if (filters.max_price) params.max_price = filters.max_price;
        if (filters.turf_type) params.turf_type = filters.turf_type;
        if (filters.amenity) params.amenity = filters.amenity;
        if (filters.ordering) params.ordering = filters.ordering;

        const data = await turfService.getTurfs(params);
        setTurfs(data);
      } catch (err) {
        console.error("Failed to fetch turfs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, [filters]);

  const handleResetFilters = () => {
    const emptyFilters = {
      city: '',
      sport: '',
      search: '',
      max_price: '3000',
      turf_type: '',
      amenity: '',
      ordering: 'featured',
    };
    setFilters(emptyFilters);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner and Quick Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Explore Sports Turfs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing {turfs.length} verified venue{turfs.length === 1 ? '' : 's'} {filters.city ? `in ${filters.city}` : 'across India'}
          </p>
        </div>

        {/* Search input & Mobile filter button */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search turf name, locality..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={filters.ordering}
            onChange={(e) => setFilters({ ...filters, ordering: e.target.value })}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>

          {/* Mobile filter button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 text-white flex items-center justify-center"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block md:col-span-1">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-2xl p-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-base">Filter Turfs</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-xs font-bold text-slate-500 p-1"
                >
                  Close ✕
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>
        )}

        {/* Turfs Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
              <span className="text-sm font-semibold">Loading available turfs...</span>
            </div>
          ) : turfs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
              <Frown className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No matching turfs found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any turfs matching your current filter criteria. Try expanding your price range or clearing city/sport filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {turfs.map((turf) => (
                <TurfCard key={turf.id} turf={turf} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
