import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { BookingCard } from '../components/BookingCard';
import { Calendar, Loader2, Frown } from 'lucide-react';

export const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load customer bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingBookings = bookings.filter(
    (b) => b.booking_status === 'confirmed' || b.booking_status === 'pending_payment'
  );

  const pastBookings = bookings.filter(
    (b) => b.booking_status === 'completed' || b.booking_status === 'cancelled' || b.booking_status === 'failed'
  );

  const displayedList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            My Match Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your ground reservations, check timings, or cancel slots.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex p-1 bg-slate-200/80 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'past'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past / Cancelled ({pastBookings.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
          <span className="text-xs font-semibold">Retrieving your match history...</span>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {activeTab === 'upcoming' ? 'No Upcoming Bookings Found' : 'No Past Bookings Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ready to hit the pitch? Browse verified sports turfs in your city and book your slot in seconds.
          </p>
          <Link
            to="/turfs"
            className="inline-block mt-2 px-5 py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-400 transition-colors"
          >
            Explore Turfs & Book
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancelSuccess={fetchBookings}
            />
          ))}
        </div>
      )}

    </div>
  );
};
