import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { Calendar, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await bookingService.getOwnerBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load owner bookings", err);
      setError('Unable to load match schedule. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = statusFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.booking_status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Player Match Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time schedule of all player reservations across your grounds.
          </p>
        </div>

        {/* Status filter & Refresh */}
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchBookings}
            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center space-x-1"
            title="Refresh bookings list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Bookings ({bookings.length})</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
          <span className="text-xs font-semibold">Loading schedule...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-2">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-800">No bookings match this filter.</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Bookings made by customers for your turfs will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="py-4 px-5">ID</th>
                  <th className="py-4 px-5">Turf Venue</th>
                  <th className="py-4 px-5">Customer</th>
                  <th className="py-4 px-5">Date & Slot</th>
                  <th className="py-4 px-5">Duration</th>
                  <th className="py-4 px-5">Payout</th>
                  <th className="py-4 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">#{b.id}</td>
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-slate-900 block">{b.turf?.name || 'Turf Venue'}</span>
                      <span className="text-[10px] text-slate-400">{b.turf?.city || b.turf?.area}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-slate-800 block">{b.customer?.name || 'Customer'}</span>
                      <span className="text-[10px] text-slate-400">{b.customer?.phone || b.customer?.email}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-medium text-slate-800 block">{b.booking_date}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">{b.duration_hours} hr</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">₹{Math.round(b.base_price || 0)}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        b.booking_status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.booking_status === 'completed'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : b.booking_status === 'cancelled'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {b.booking_status?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
