import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { turfService } from '../services/turfService';
import { 
  Building2, 
  MapPin, 
  Phone, 
  IndianRupee, 
  Clock, 
  Image as ImageIcon, 
  Check, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export const OwnerAddTurf = () => {
  const navigate = useNavigate();

  const [sportsList, setSportsList] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: 'Pune',
    area: '',
    address: '',
    contact_phone: '',
    contact_email: '',
    turf_type: 'outdoor',
    base_price_per_hour: '1200',
    weekend_price_per_hour: '1500',
    opening_time: '06:00',
    closing_time: '23:00',
    slot_duration_mins: 60,
    cover_image_url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
    venue_rules: '1. Proper sports shoes required.\n2. Arrive 15 minutes before slot.\n3. Keep the premises clean.',
    cancellation_policy: 'Free cancellation up to 4 hours before the booked slot.',
    sports_ids: [],
    amenities_ids: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const [sports, amenities] = await Promise.all([
          turfService.getSports(),
          turfService.getAmenities()
        ]);
        setSportsList(sports || []);
        setAmenitiesList(amenities || []);
        if (sports && sports.length > 0) {
          setFormData((prev) => ({
            ...prev,
            sports_ids: [sports[0].id],
          }));
        }
      } catch (err) {
        console.error("Failed to load sports/amenities", err);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleSportToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.sports_ids.includes(id);
      return {
        ...prev,
        sports_ids: exists ? prev.sports_ids.filter((sId) => sId !== id) : [...prev.sports_ids, id],
      };
    });
  };

  const handleAmenityToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.amenities_ids.includes(id);
      return {
        ...prev,
        amenities_ids: exists ? prev.amenities_ids.filter((aId) => aId !== id) : [...prev.amenities_ids, id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sports_ids.length === 0) {
      setError("Please select at least one sport.");
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await turfService.createTurf(formData);
      navigate('/owner/turfs');
    } catch (err) {
      console.error("Failed to create turf", err);
      setError(err.response?.data?.detail || 'Failed to list turf. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          List a New Sports Ground
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Publish your venue details, upload high-res photos, set slot pricing, and start accepting online bookings.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Basic Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            1. Venue Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Turf Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Football & Cricket Arena"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Turf Setting *
              </label>
              <select
                value={formData.turf_type}
                onChange={(e) => setFormData({ ...formData, turf_type: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="outdoor">Outdoor Ground</option>
                <option value="indoor">Indoor Arena</option>
                <option value="both">Both Indoor & Outdoor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Description *
            </label>
            <textarea
              rows="3"
              required
              placeholder="Highlight artificial grass quality, LED lighting, spectator area, tournaments hosted..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* 2. Location & Contact */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            2. Location & Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                City *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Area / Locality *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kothrud, Baner, Bandra"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Full Physical Address *
            </label>
            <input
              type="text"
              required
              placeholder="Survey No, Street, Landmark, Pin code"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98220 12345"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="contact@venue.com"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Sports & Amenities */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            3. Sports & Amenities
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Sports Available (Select all that apply) *
            </label>
            <div className="flex flex-wrap gap-2">
              {sportsList.map((sport) => {
                const isSelected = formData.sports_ids.includes(sport.id);
                return (
                  <button
                    key={sport.id}
                    type="button"
                    onClick={() => handleSportToggle(sport.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{sport.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Amenities Provided
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {amenitiesList.map((amenity) => {
                const isSelected = formData.amenities_ids.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-left flex items-center space-x-2 transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{amenity.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Pricing & Timings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            4. Pricing & Operating Hours
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Standard Hourly Rate (₹) *
              </label>
              <input
                type="number"
                required
                min="100"
                value={formData.base_price_per_hour}
                onChange={(e) => setFormData({ ...formData, base_price_per_hour: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Weekend Hourly Rate (₹)
              </label>
              <input
                type="number"
                min="100"
                value={formData.weekend_price_per_hour}
                onChange={(e) => setFormData({ ...formData, weekend_price_per_hour: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Slot Duration (Minutes)
              </label>
              <select
                value={formData.slot_duration_mins}
                onChange={(e) => setFormData({ ...formData, slot_duration_mins: parseInt(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={60}>60 Minutes (Standard)</option>
                <option value={90}>90 Minutes</option>
                <option value={120}>120 Minutes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Opening Time
              </label>
              <input
                type="time"
                value={formData.opening_time}
                onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Closing Time
              </label>
              <input
                type="time"
                value={formData.closing_time}
                onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* 5. Imagery */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            5. Venue Photos
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Cover Image URL (Direct Web or Cloudinary URL) *
            </label>
            <input
              type="url"
              required
              value={formData.cover_image_url}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>

          {formData.cover_image_url && (
            <div className="h-40 w-full sm:w-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img src={formData.cover_image_url} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Publishing your turf venue...</span>
            </>
          ) : (
            <span>Publish Venue & Activate Bookings</span>
          )}
        </button>
      </form>

    </div>
  );
};
