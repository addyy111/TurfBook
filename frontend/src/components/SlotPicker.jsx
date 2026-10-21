import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sun, Moon, Check, AlertCircle, Loader2 } from 'lucide-react';
import { turfService } from '../services/turfService';

export const SlotPicker = ({ turf, onSlotSelect, selectedSlot, selectedDate, setSelectedDate, duration, setDuration }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate next 6 days - Mention ONLY the day name (e.g. Mon, Tue, Wed) to fit perfectly without overflow
  const dateOptions = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayName, formattedDate };
  });

  useEffect(() => {
    const fetchSlots = async () => {
      if (!turf?.id) return;
      try {
        setLoading(true);
        setError('');
        const res = await turfService.getAvailability(turf.id, selectedDate);
        setSlots(res.slots || []);
      } catch (err) {
        console.error("Failed to load availability slots", err);
        setError('Failed to fetch available slots for this date.');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [turf?.id, selectedDate]);

  // Group slots into Morning, Afternoon, Evening
  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.start_time.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.start_time.split(':')[0], 10);
    return hour >= 12 && hour < 16;
  });

  const eveningSlots = slots.filter((s) => {
    const hour = parseInt(s.start_time.split(':')[0], 10);
    return hour >= 16;
  });

  const renderSlotGrid = (slotList, title, icon) => {
    if (slotList.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase text-slate-500 mb-2">
          {icon}
          <span>{title}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {slotList.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            const isAvailable = slot.is_available && !slot.is_blocked;
            const timeFormatted = `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={!isAvailable}
                onClick={() => isAvailable && onSlotSelect(slot)}
                title={!isAvailable ? 'This slot has already been booked by another player' : 'Click to select this slot'}
                className={`relative p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center min-h-[60px] ${
                  !isAvailable
                    ? 'bg-rose-50/50 border-rose-200/60 text-slate-400 cursor-not-allowed select-none'
                    : isSelected
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/30 cursor-pointer'
                    : 'bg-white hover:bg-emerald-50/50 border-slate-200 text-slate-800 hover:border-emerald-300 cursor-pointer'
                }`}
              >
                <span className={`text-xs font-semibold ${!isAvailable ? 'line-through text-slate-400' : ''}`}>
                  {timeFormatted}
                </span>

                <div className="mt-1">
                  {!isAvailable ? (
                    <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-100/90 px-1.5 py-0.5 rounded">
                      Already Booked
                    </span>
                  ) : (
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-slate-950' : 'text-slate-600'}`}>
                      ₹{Math.round(slot.price)}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-950 text-white rounded-full p-0.5 shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Date Selector Carousel - Mention ONLY the day to prevent any text overflowing */}
      <div>
        <label className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          <Calendar className="w-4 h-4 mr-1.5 text-emerald-600" />
          <span>Select Date</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {dateOptions.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => {
                  setSelectedDate(item.dateStr);
                  if (onSlotSelect) onSlotSelect(null);
                }}
                className={`py-2 px-1 rounded-xl border text-center transition-all overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {item.dayName}
                </div>
                <div className="text-xs font-bold mt-0.5 whitespace-nowrap">
                  {item.formattedDate}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Duration Selector */}
      <div>
        <label className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          <Clock className="w-4 h-4 mr-1.5 text-emerald-600" />
          <span>Duration (Hours)</span>
        </label>
        <div className="flex space-x-2">
          {[1, 1.5, 2, 3].map((dur) => (
            <button
              key={dur}
              type="button"
              onClick={() => setDuration(dur)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                duration === dur
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {dur} hr{dur > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Slot Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 py-1">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-white border border-slate-300" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="font-semibold text-slate-800">Selected</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-rose-100 border border-rose-300" />
          <span className="text-rose-600 font-semibold">Already Booked</span>
        </div>
      </div>

      {/* 4. Slot Grids */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-500 mb-2" />
          <span className="text-xs font-medium">Checking live slot availability...</span>
        </div>
      ) : error ? (
        <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <p className="text-sm font-semibold text-slate-700">No scheduled slots for this date</p>
          <p className="text-xs text-slate-400 mt-1">Please pick another date or contact the turf owner.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {renderSlotGrid(morningSlots, 'Morning Slots (6 AM - 12 PM)', <Sun className="w-4 h-4 text-amber-500" />)}
          {renderSlotGrid(afternoonSlots, 'Afternoon Slots (12 PM - 4 PM)', <Sun className="w-4 h-4 text-orange-500" />)}
          {renderSlotGrid(eveningSlots, 'Evening & Night Slots (4 PM - 11 PM)', <Moon className="w-4 h-4 text-indigo-500" />)}
        </div>
      )}
    </div>
  );
};
