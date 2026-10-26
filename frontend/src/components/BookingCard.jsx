import React, { useState } from 'react';
import { Calendar, Clock, MapPin, IndianRupee } from 'lucide-react';
import { bookingService } from '../services/bookingService';

export const BookingCard = ({ booking, onCancelSuccess }) => {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  const statusStyles = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
    failed: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setCancelling(true);
      setError('');
      await bookingService.cancelBooking(booking.id, 'Customer requested cancellation');
      if (onCancelSuccess) {
        onCancelSuccess(booking.id);
      }
    } catch (err) {
      console.error("Cancellation failed", err);
      setError(err.response?.data?.error || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const turf = booking.turf || {};
  const isCancellable = booking.booking_status === 'confirmed';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Booking #{booking.id}</span>
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                statusStyles[booking.booking_status] || 'bg-slate-50 text-slate-700'
              }`}
            >
              {booking.booking_status.replace('_', ' ')}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">{turf.name}</h3>
          <div className="flex items-center text-xs text-slate-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <span>{turf.area}, {turf.city}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block font-medium">Total Paid</span>
          <span className="text-xl font-black text-slate-900">₹{Math.round(booking.total_price)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-xs">
        <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Date</span>
            <span className="font-semibold text-slate-800">{booking.booking_date}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Slot Time</span>
            <span className="font-semibold text-slate-800">
              {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)} ({booking.duration_hours} hr)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <IndianRupee className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Pricing</span>
            <span className="font-semibold text-slate-800">
              Base: ₹{Math.round(booking.base_price)} + Fee: ₹{Math.round(booking.platform_fee)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 mb-3">{error}</p>
      )}

      {isCancellable && (
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-xs font-semibold px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        </div>
      )}
    </div>
  );
};
