import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Heart, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  Share2,
  Calendar,
  IndianRupee,
  Loader2,
  Send
} from 'lucide-react';
import { turfService } from '../services/turfService';
import { useAuth } from '../context/AuthContext';
import { SlotPicker } from '../components/SlotPicker';
import api from '../services/api';

export const TurfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);

  // Booking state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [duration, setDuration] = useState(1);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        setLoading(true);
        const data = await turfService.getTurfById(id);
        setTurf(data);
        setIsFavorited(data.is_favorited);
        setSelectedImage(data.cover_image_url || data.cover_image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80');

        // Fetch reviews for this turf
        const reviewsRes = await api.get(`/reviews/turf/${id}/`);
        setReviews(reviewsRes.data || []);
      } catch (err) {
        console.error("Failed to load turf details", err);
        setError('Turf not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchTurf();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await turfService.toggleWishlist(turf.id);
      setIsFavorited(res.favorited);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceedToBooking = () => {
    if (!selectedSlot) {
      alert("Please select an available time slot to continue.");
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/turfs/${id}` } });
      return;
    }

    const isWeekend = new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6;
    const hourlyRate = (isWeekend && turf.weekend_price_per_hour) ? parseFloat(turf.weekend_price_per_hour) : parseFloat(turf.base_price_per_hour);
    const basePrice = Math.round(hourlyRate * duration);
    const platformFee = 40;
    const totalPrice = basePrice + platformFee;

    navigate(`/booking/${id}`, {
      state: {
        turf,
        selectedDate,
        selectedSlot,
        duration,
        basePrice,
        platformFee,
        totalPrice
      }
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingReview(true);
      setReviewError('');
      const res = await api.post('/reviews/create/', {
        turf: turf.id,
        rating: newRating,
        comment: newComment.trim(),
      });
      setReviews([res.data, ...reviews]);
      setNewComment('');
    } catch (err) {
      console.error("Failed to submit review", err);
      setReviewError('Failed to post review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-3" />
        <p className="text-sm font-semibold">Loading venue details & live slots...</p>
      </div>
    );
  }

  if (error || !turf) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">{error || 'Venue Not Found'}</h2>
        <Link to="/turfs" className="mt-4 inline-block px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-sm">
          Browse Other Turfs
        </Link>
      </div>
    );
  }

  // Price calculations
  const isWeekend = new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6;
  const currentHourlyRate = (isWeekend && turf.weekend_price_per_hour) ? parseFloat(turf.weekend_price_per_hour) : parseFloat(turf.base_price_per_hour);
  const calculatedBasePrice = Math.round(currentHourlyRate * duration);
  const platformFee = 40;
  const grandTotal = calculatedBasePrice + platformFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
        <Link to="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/turfs?city=${turf.city}`} className="hover:text-slate-700">Turfs in {turf.city}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">{turf.name}</span>
      </nav>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-slate-900 text-emerald-400 px-3 py-1 rounded-md">
              {turf.turf_type} Turf
            </span>
            <span className="flex items-center text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Sports Facility
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            {turf.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
              <span>{turf.address || `${turf.area}, ${turf.city}`}</span>
            </div>
            <div className="flex items-center bg-slate-900 text-white px-2.5 py-0.5 rounded-lg font-bold">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
              <span>{turf.average_rating || 4.5}</span>
              <span className="text-slate-400 font-normal ml-1">({turf.total_reviews || reviews.length} reviews)</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleWishlistToggle}
            className={`p-3 rounded-2xl border transition-all flex items-center space-x-2 text-xs font-bold ${
              isFavorited
                ? 'bg-pink-50 border-pink-200 text-pink-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-pink-500 text-pink-500' : 'text-slate-400'}`} />
            <span>{isFavorited ? 'Saved in Wishlist' : 'Save Turf'}</span>
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="space-y-3">
        <div className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden bg-slate-900 shadow-md">
          <img
            src={selectedImage}
            alt={turf.name}
            className="w-full h-full object-cover"
          />
        </div>

        {turf.images && turf.images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[turf.cover_image_url || turf.cover_image, ...turf.images.map(img => img.image_url || img.image)].filter(Boolean).map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(imgUrl)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  selectedImage === imgUrl ? 'border-emerald-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Details & Booking Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Info, Amenities, Rules, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Sports Supported */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">Sports Supported</h3>
            <div className="flex flex-wrap gap-2">
              {turf.sports?.map((s) => (
                <div
                  key={s.id || s.name}
                  className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <span>🏏</span>
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">About the Venue</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {turf.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Amenities & Facilities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {turf.amenities?.map((a) => (
                <div
                  key={a.id || a.name}
                  className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{a.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Venue Rules & Cancellation Policy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Ground Rules</h3>
              <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">
                {turf.venue_rules || '1. Proper sports shoes mandatory.\n2. Please arrive 15 minutes before the booked time.\n3. Keep the playing surface clean.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Cancellation Policy</h3>
              <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">
                {turf.cancellation_policy || 'Free cancellation up to 4 hours before the booked time slot. 50% refund thereafter.'}
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Need Assistance?</span>
              <h4 className="text-base font-bold text-white mt-0.5">Contact Venue Coordinator</h4>
            </div>
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <div className="flex items-center space-x-1.5 text-slate-200">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{turf.contact_phone}</span>
              </div>
              {turf.contact_email && (
                <div className="flex items-center space-x-1.5 text-slate-200">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{turf.contact_email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Player Reviews ({reviews.length})</h3>
              <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 px-3 py-1 rounded-xl text-xs font-bold border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{turf.average_rating || 4.5} out of 5.0</span>
              </div>
            </div>

            {/* Write a Review form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Write Your Review
                </span>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold text-slate-700">Rating:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows="3"
                  placeholder="Share your experience about turf grass quality, lighting, parking..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />

                {reviewError && <p className="text-xs text-red-600">{reviewError}</p>}

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </form>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                <Link to="/login" className="font-bold text-emerald-600 hover:underline">
                  Log in
                </Link>{' '}
                to leave a review for this turf.
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4 pt-2">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No player reviews yet. Be the first to leave one!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          {rev.customer?.name?.charAt(0) || 'P'}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{rev.customer?.name || 'Verified Player'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-9">
                      {rev.comment}
                    </p>
                    <span className="text-[10px] text-slate-400 block pl-9">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Booking Widget with SlotPicker */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl space-y-6">
            
            {/* Widget Pricing Header */}
            <div className="pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {isWeekend ? 'Weekend Rate' : 'Standard Rate'}
              </span>
              <div className="flex items-baseline mt-1">
                <span className="text-3xl font-black text-slate-900">
                  ₹{Math.round(currentHourlyRate)}
                </span>
                <span className="text-sm font-semibold text-slate-500 ml-1.5">/ hour</span>
              </div>
              {turf.opening_time && (
                <div className="flex items-center text-xs text-slate-500 mt-2">
                  <Clock className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  <span>Open: {turf.opening_time?.slice(0, 5)} - {turf.closing_time?.slice(0, 5)}</span>
                </div>
              )}
            </div>

            {/* Embedded SlotPicker */}
            <SlotPicker
              turf={turf}
              selectedSlot={selectedSlot}
              onSlotSelect={setSelectedSlot}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              duration={duration}
              setDuration={setDuration}
            />

            {/* Price Summary Breakdown */}
            {selectedSlot && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Rate ({duration} hr{duration > 1 ? 's' : ''})</span>
                  <span className="font-semibold text-slate-900">₹{calculatedBasePrice}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform & Processing Fee</span>
                  <span className="font-semibold text-slate-900">₹{platformFee}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-emerald-600 font-extrabold text-base">₹{grandTotal}</span>
                </div>
              </div>
            )}

            {/* Booking CTA Button */}
            <button
              onClick={handleProceedToBooking}
              className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
                selectedSlot
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{selectedSlot ? 'Proceed to Checkout' : 'Select a Slot to Book'}</span>
            </button>

            <p className="text-[11px] text-center text-slate-400">
              ⚡ Instant slot confirmation • No double booking guarantee
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
