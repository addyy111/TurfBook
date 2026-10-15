import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart, Clock, ShieldCheck } from 'lucide-react';
import { turfService } from '../services/turfService';
import { useAuth } from '../context/AuthContext';

export const TurfCard = ({ turf, onWishlistToggle }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(turf.is_favorited || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80';
  const imageUrl = turf.cover_image_url || turf.cover_image || fallbackImage;

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setWishlistLoading(true);
      const res = await turfService.toggleWishlist(turf.id);
      setIsFavorited(res.favorited);
      if (onWishlistToggle) {
        onWishlistToggle(turf.id, res.favorited);
      }
    } catch (err) {
      console.error("Wishlist error", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={turf.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-emerald-400 px-2.5 py-1 rounded-md border border-slate-700/50">
            {turf.turf_type}
          </span>
          {turf.approval_status === 'approved' && (
            <span className="flex items-center text-[10px] font-semibold bg-emerald-500/90 text-slate-950 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Verified
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleHeartClick}
          disabled={wishlistLoading}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:text-pink-500 transition-colors border border-white/10 shadow-sm"
          title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${isFavorited ? 'fill-pink-500 text-pink-500 scale-110' : 'text-white'}`}
          />
        </button>

        {/* Rating chip on bottom image */}
        <div className="absolute bottom-3 left-3 flex items-center bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-xs font-semibold border border-slate-700/50">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
          <span>{turf.average_rating || '4.5'}</span>
          <span className="text-slate-400 ml-1 font-normal">({turf.total_reviews || 0})</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Sports tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {turf.sports?.map((s) => (
              <span
                key={s.id || s.name}
                className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100"
              >
                {s.name}
              </span>
            ))}
          </div>

          {/* Turf Name */}
          <Link to={`/turfs/${turf.id}`}>
            <h3 className="text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1 mb-1">
              {turf.name}
            </h3>
          </Link>

          {/* Location Area & City */}
          <div className="flex items-center text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
            <span className="truncate">{turf.area}, {turf.city}</span>
          </div>

          {/* Amenities snippets */}
          {turf.amenities && turf.amenities.length > 0 && (
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mb-3 line-clamp-1">
              {turf.amenities.slice(0, 3).map((a, idx) => (
                <span key={a.id || a.name} className="inline-flex items-center">
                  • {a.name}
                </span>
              ))}
              {turf.amenities.length > 3 && (
                <span className="text-slate-400">+{turf.amenities.length - 3} more</span>
              )}
            </div>
          )}
        </div>

        {/* Footer Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Starting from</span>
            <div className="flex items-baseline">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{Math.round(turf.base_price_per_hour)}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ hr</span>
            </div>
          </div>

          <Link
            to={`/turfs/${turf.id}`}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-600/20 transition-all"
          >
            Book Slot
          </Link>
        </div>
      </div>
    </div>
  );
};
