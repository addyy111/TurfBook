import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { turfService } from '../services/turfService';
import { PlusCircle, MapPin, Star, Eye, ShieldCheck, Loader2 } from 'lucide-react';

export const OwnerTurfs = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerTurfs = async () => {
      try {
        setLoading(true);
        const data = await turfService.getOwnerTurfs();
        setTurfs(data || []);
      } catch (err) {
        console.error("Failed to load owner turfs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerTurfs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            My Sports Grounds
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage pricing, sports configurations, and listings.
          </p>
        </div>

        <Link
          to="/owner/turfs/add"
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Turf</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
          <span className="text-xs font-semibold">Loading your listed venues...</span>
        </div>
      ) : turfs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <p className="text-base font-bold text-slate-800">You haven't listed any turfs yet.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your sports facility to start receiving match bookings and online payments from players.
          </p>
          <Link
            to="/owner/turfs/add"
            className="inline-block mt-2 px-5 py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl shadow-sm"
          >
            Create First Turf Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfs.map((turf) => (
            <div
              key={turf.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-100">
                <img
                  src={turf.cover_image_url || turf.cover_image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80'}
                  alt={turf.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold uppercase bg-slate-900/80 backdrop-blur-md text-emerald-400 px-2 py-0.5 rounded-md">
                    {turf.approval_status}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{turf.name}</h3>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    <span>{turf.area}, {turf.city}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
                    <span className="text-slate-500">Hourly Rate</span>
                    <span className="font-extrabold text-slate-900">₹{Math.round(turf.base_price_per_hour || 0)}/hr</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/turfs/${turf.id}`}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Public Page</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
