import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  CalendarCheck, 
  IndianRupee, 
  PlusCircle, 
  ArrowRight, 
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { turfService } from '../services/turfService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [turfs, setTurfs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const [turfsData, bookingsData] = await Promise.all([
          turfService.getOwnerTurfs(),
          bookingService.getOwnerBookings()
        ]);
        setTurfs(Array.isArray(turfsData) ? turfsData : []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (err) {
        console.error("Failed to load owner dashboard data", err);
        setError('Failed to load dashboard data. Please check your network connection or log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.booking_status === 'confirmed' || b.booking_status === 'completed')
    .reduce((acc, curr) => acc + parseFloat(curr.base_price || 0), 0);

  const upcomingBookings = bookings.filter((b) => b.booking_status === 'confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
            Turf Owner Management Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome back, {user?.name?.split(' ')[0] || 'Partner'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time overview of your turf grounds, customer reservations, and schedule.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/owner/turfs/add"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Turf</span>
          </Link>
          <Link
            to="/owner/turfs"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            My Venues ({turfs.length})
          </Link>
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
          <span className="text-xs font-semibold">Loading owner analytics and live bookings...</span>
        </div>
      ) : (
        <>
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Total Turfs Listed</span>
                <span className="text-2xl font-black text-slate-900">{turfs.length}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Total Reservations</span>
                <span className="text-2xl font-black text-slate-900">{bookings.length}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Total Match Payout</span>
                <span className="text-2xl font-black text-slate-900">₹{Math.round(totalRevenue)}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Upcoming Confirmed</span>
                <span className="text-2xl font-black text-slate-900">{upcomingBookings.length}</span>
              </div>
            </div>
          </div>

          {/* Recent Reservations Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Customer Bookings & Reservations</h3>
                <p className="text-xs text-slate-400 mt-0.5">Live schedule of player matches across your sports grounds.</p>
              </div>
              <Link to="/owner/bookings" className="text-xs font-bold text-emerald-600 hover:underline flex items-center">
                <span>View Full Schedule ({bookings.length})</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
                <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No customer bookings yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When players book match slots at your turfs, they will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Turf Ground</th>
                      <th className="py-3 px-4">Player</th>
                      <th className="py-3 px-4">Date & Slot</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.slice(0, 10).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-black text-slate-900">#{b.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{b.turf?.name || 'Turf Venue'}</span>
                          <span className="text-[10px] text-slate-400">{b.turf?.city || b.turf?.area}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">{b.customer?.name || 'Customer'}</span>
                          <span className="text-[10px] text-slate-400">{b.customer?.phone || b.customer?.email}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">{b.booking_date}</span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{b.duration_hours} hr</td>
                        <td className="py-3.5 px-4 font-black text-emerald-600">₹{Math.round(b.base_price || 0)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            b.booking_status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : b.booking_status === 'completed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : b.booking_status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {b.booking_status?.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};
