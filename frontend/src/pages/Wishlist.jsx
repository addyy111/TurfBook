import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { turfService } from '../services/turfService';
import { TurfCard } from '../components/TurfCard';
import { Heart, Loader2 } from 'lucide-react';

export const Wishlist = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const data = await turfService.getWishlist();
        setTurfs(data);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleWishlistToggle = (turfId, isFavorited) => {
    if (!isFavorited) {
      setTurfs((prev) => prev.filter((t) => t.id !== turfId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Saved Turfs
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your bookmarked sports facilities and arenas for quick access.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
          <span className="text-xs font-semibold">Loading your saved venues...</span>
        </div>
      ) : turfs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any turf card to save your favorite venues here for fast booking later.
          </p>
          <Link
            to="/turfs"
            className="inline-block mt-2 px-5 py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-400 transition-colors"
          >
            Explore Turfs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfs.map((turf) => (
            <TurfCard
              key={turf.id}
              turf={{ ...turf, is_favorited: true }}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
