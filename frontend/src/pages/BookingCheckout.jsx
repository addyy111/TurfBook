import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building2,
  UserCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';

export const BookingCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const checkoutData = location.state;
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!checkoutData || !checkoutData.turf || !checkoutData.selectedSlot) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">No Active Booking Session</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">Please select a turf and time slot to begin checkout.</p>
        <Link to="/turfs" className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs inline-block">
          Explore Turfs
        </Link>
      </div>
    );
  }

  const { turf, selectedDate, selectedSlot, duration, basePrice, platformFee, totalPrice } = checkoutData;

  const handleConfirmBooking = async () => {
    try {
      setProcessing(true);
      setError('');

      // Create booking directly in Django backend (with server-side concurrency lock)
      const bookingPayload = {
        turf_id: turf.id,
        booking_date: selectedDate,
        start_time: selectedSlot.start_time,
        duration_hours: duration,
      };

      const booking = await bookingService.createBooking(bookingPayload);
      setConfirmedBooking(booking);
    } catch (err) {
      console.error("Booking creation failed", err);
      let backendError = 'Booking failed. This slot may have just been booked by another user.';
      if (err.response?.data) {
        const d = err.response.data;
        if (typeof d === 'string') {
          backendError = d;
        } else if (d.slot) {
          backendError = Array.isArray(d.slot) ? d.slot[0] : d.slot;
        } else if (d.detail) {
          backendError = d.detail;
        } else if (d.error) {
          backendError = d.error;
        } else if (typeof d === 'object') {
          const values = Object.values(d).flat();
          backendError = values.join(' ');
        }
      }
      setError(backendError);
    } finally {
      setProcessing(false);
    }
  };

  // If confirmed, show congratulations screen
  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
              Slot Reserved Successfully
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Booking Confirmed!</h1>
            <p className="text-sm text-slate-500">
              Your match slot is reserved. The turf management team has been notified.
            </p>
          </div>

          {/* Booking Summary Ticket */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-400">Booking Reference</span>
                <p className="text-base font-bold text-slate-900">#{confirmedBooking.id}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Price</span>
                <p className="text-xl font-black text-emerald-600">₹{totalPrice}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Turf Venue</span>
                <span className="font-bold text-slate-800 text-sm">{turf.name}</span>
                <span className="text-slate-500 block">{turf.address || `${turf.area}, ${turf.city}`}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Date & Slot</span>
                <span className="font-bold text-slate-800 text-sm">{selectedDate}</span>
                <span className="text-slate-600 font-semibold block mt-0.5">
                  {selectedSlot.start_time?.slice(0, 5)} - {selectedSlot.end_time?.slice(0, 5)} ({duration} hr)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-xs flex items-center justify-between text-slate-600">
              <span>Player: <strong className="text-slate-900">{user?.name}</strong></span>
              <span>Status: <strong className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold uppercase text-[10px]">Confirmed</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/my-bookings"
              className="flex-1 py-3 px-4 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>View My Bookings</span>
            </Link>
            <Link
              to="/turfs"
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-800 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Explore More Turfs</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 space-x-1 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Turf Details</span>
      </button>

      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Review & Confirm Booking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Lock in your match time directly with zero hassle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Booking Confirmation Card */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Customer Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-slate-900">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Player Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-400 block font-medium">Player Name</span>
                <span className="font-bold text-slate-800 text-sm">{user?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email Address</span>
                <span className="font-bold text-slate-800 text-sm">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Instant Booking Notice */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold">
                Instant Confirmation Guarantee
              </h3>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              No advance online payment required! Your slot will be instantly confirmed and reserved exclusively for you. Any fees can be settled directly at the venue upon arrival.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-800 pt-1">
              <span className="flex items-center">
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600 stroke-[3]" />
                Zero Booking Fees
              </span>
              <span className="flex items-center">
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600 stroke-[3]" />
                Instant Slot Lock
              </span>
              <span className="flex items-center">
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600 stroke-[3]" />
                Free Cancellation
              </span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 space-y-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-sm">{error}</span>
              </div>
              <p className="text-[11px] text-red-600">
                Another player may have already booked this slot. Please select another slot from the venue page.
              </p>
              <div>
                <Link
                  to={`/turfs/${turf.id}`}
                  className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Choose Another Slot
                </Link>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirmBooking}
            disabled={processing}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-base flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Locking slot and confirming reservation...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Confirm Booking (Pay ₹{totalPrice} at Venue)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Booking Summary
            </h3>

            <div className="space-y-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">{turf.name}</h4>
                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
                  <span>{turf.area}, {turf.city}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold">{selectedDate}</span>
                </div>

                <div className="flex items-center space-x-2 text-slate-700">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold">
                    {selectedSlot.start_time?.slice(0, 5)} - {selectedSlot.end_time?.slice(0, 5)} ({duration} hr)
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Slot Base Rate</span>
                  <span className="font-semibold text-slate-900">₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Service Fee</span>
                  <span className="font-semibold text-slate-900">₹{platformFee}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-600 text-lg font-extrabold">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">Cancellation Policy</span>
            <p>Free cancellation up to 4 hours before your match slot from the My Bookings section.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
