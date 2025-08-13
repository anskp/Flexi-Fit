// src/pages/Schedule.jsx
import { useState, useMemo, useEffect } from 'react';

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, title: 'Strength Training', client: 'Sarah Johnson', day: 1, time: '6:00 PM', duration: '60 min', type: 'session', color: 'from-blue-500 to-emerald-600', notes: 'Focus on back & shoulders' },
    { id: 2, title: 'HIIT Class', client: 'Group (8 people)', day: 2, time: '7:30 AM', duration: '45 min', type: 'class', color: 'from-indigo-500 to-violet-600', notes: 'Burn 500+ calories' },
    { id: 3, title: 'Yoga & Mobility', client: 'Lisa Wong', day: 4, time: '6:00 PM', duration: '60 min', type: 'session', color: 'from-emerald-500 to-teal-600', notes: 'Hip mobility focus' },
    { id: 4, title: 'Available', client: 'Open Slot', day: 0, time: '10:00 AM', duration: '60 min', type: 'availability', color: 'from-gray-400 to-gray-600' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', client: '', day: '', time: '', duration: '60 min', type: 'session', notes: '' });
  const [loading, setLoading] = useState(false);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour}:00 ${period}`;
  });

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); return d; }), [currentDate]);

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const goToPreviousWeek = () => { const newDate = new Date(currentDate); newDate.setDate(newDate.getDate() - 7); setCurrentDate(newDate); };
  const goToNextWeek = () => { const newDate = new Date(currentDate); newDate.setDate(newDate.getDate() + 7); setCurrentDate(newDate); };
  const goToToday = () => setCurrentDate(new Date());

  const openModal = (event = null) => {
    if (event) {
      setIsEditing(true);
      setNewEvent({ id: event.id, title: event.title, client: event.client, day: event.day, time: event.time, duration: event.duration, type: event.type, notes: event.notes });
      setSelectedEvent(event);
    } else {
      setIsEditing(false);
      setNewEvent({ title: '', client: '', day: '', time: '', duration: '60 min', type: 'session', notes: '' });
    }
    setShowModal(true);
  };

  const handleEventChange = (e) => { const { name, value } = e.target; setNewEvent({ ...newEvent, [name]: value }); };
  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.time || newEvent.day === '') { alert('Please fill in title, time, and day.'); return; }
    setLoading(true);
    setTimeout(() => {
      if (isEditing && selectedEvent) {
        setEvents((prev) => prev.map((e) => (e.id === selectedEvent.id ? { ...e, ...newEvent } : e)));
      } else {
        const newId = Math.max(...events.map((e) => e.id), 0) + 1;
        setEvents((prev) => [...prev, { ...newEvent, id: newId, color: newEvent.type === 'session' ? 'from-blue-500 to-emerald-600' : newEvent.type === 'class' ? 'from-indigo-500 to-violet-600' : 'from-gray-400 to-gray-600' }]);
      }
      setLoading(false);
      setShowModal(false);
    }, 500);
  };
  const deleteEvent = () => { setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id)); setShowModal(false); setSelectedEvent(null); };

  const renderEventCell = (dayIndex, time) => {
    const dayEvents = events.filter((e) => e.day === dayIndex && e.time === time);
    return dayEvents.map((event) => (
      <div key={event.id} className={`text-xs text-white p-2 rounded-lg mb-1 cursor-pointer shadow-md transform hover:scale-105 transition-all duration-200 bg-gradient-to-r ${event.color} transform-hover glow-hover`} onClick={(e) => { e.stopPropagation(); openModal(event); }} title={`${event.title} with ${event.client}`}>
        <div className="font-semibold">{event.title}</div><div className="opacity-90 text-xs">{event.client}</div><div className="opacity-75 text-xs mt-0.5">{event.duration}</div>
      </div>
    ));
  };
  
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') { setShowModal(false); setSelectedEvent(null); } };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-800">📅 Weekly Schedule</h1><p className="text-gray-600 mt-2">Manage your sessions, classes, and availability</p></div>
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/30 mb-8 transform-hover">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4"><div className="flex items-center gap-4"><button onClick={goToPreviousWeek} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition">← Prev</button><h2 className="text-lg font-semibold text-gray-800 text-center min-w-48">Week of {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h2><button onClick={goToNextWeek} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition">Next →</button></div><div className="flex gap-3"><button onClick={goToToday} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium">Today</button><button onClick={() => openModal()} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-medium transform-hover shadow-md hover:shadow-lg">➕ Add Session</button></div></div>
      </div>
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/30 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-white/20 bg-white/30"><div className="p-4 font-semibold text-gray-700"></div>{weekDates.map((date, i) => (<div key={i} className={`p-4 text-center font-medium ${isToday(date) ? 'bg-gradient-to-br from-blue-500 to-emerald-600 text-white rounded-t-xl shadow-md' : 'text-gray-700'}`}><div className="text-sm font-medium">{weekDays[i]}</div><div className={`mt-1 w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all ${isToday(date) ? 'bg-white/30' : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-blue-500/20'}`}>{date.getDate()}</div></div>))}</div>
        <div className="divide-y divide-white/10">{hours.slice(6, 22).map((time) => (<div key={time} className="grid grid-cols-8 text-sm"><div className="p-3 text-right text-gray-500 border-r border-white/20 bg-white/20 font-medium">{time}</div>{weekDates.map((date, dayIndex) => (<div key={dayIndex} className={`p-2 min-h-16 border-r border-white/20 ${isToday(date) ? 'bg-blue-50' : 'hover:bg-white/30'} transition-all duration-200 relative group`} onClick={() => { setNewEvent({ ...newEvent, day: dayIndex, time }); openModal(); }}><div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none flex items-center justify-center"><span className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded">+ Add</span></div>{renderEventCell(dayIndex, time)}</div>))}</div>))}</div>
      </div>
      <div className="mt-8 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/30 text-sm text-gray-600"><div className="flex flex-wrap items-center gap-6"><p><span className="font-bold text-gray-800">{events.length}</span> scheduled items</p>{[{ type: 'Session', color: 'from-blue-500 to-emerald-600' }, { type: 'Class', color: 'from-indigo-500 to-violet-600' }, { type: 'Available', color: 'from-gray-400 to-gray-600' }].map((item) => (<div key={item.type} className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}></span><span>{item.type}</span></div>))}</div></div>
      {showModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"><div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/30 max-h-screen overflow-y-auto transform hover:scale-[1.01] transition"><h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">{isEditing ? '✏️ Edit Session' : '➕ Add New Session'}</h3>{loading ? (<div className="py-8 text-center"><div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div><p className="mt-4 text-gray-600">Saving...</p></div>) : (<form className="space-y-5"><div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" name="title" value={newEvent.title} onChange={handleEventChange} placeholder="e.g. Strength Training" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-3 focus:ring-blue-500/50" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Client / Group</label><input type="text" name="client" value={newEvent.client} onChange={handleEventChange} placeholder="e.g. Sarah Johnson" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-3 focus:ring-blue-500/50" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Day</label><select name="day" value={newEvent.day} onChange={handleEventChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-3 focus:ring-blue-500/50"><option value="">Select a day</option>{weekDays.map((day, i) => (<option key={i} value={i}>{day} ({weekDates[i].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</option>))}</select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input type="text" name="time" value={newEvent.time} onChange={handleEventChange} placeholder="e.g. 6:00 PM" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-3 focus:ring-blue-500/50" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label><select name="duration" value={newEvent.duration} onChange={handleEventChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-3 focus:ring-blue-500/50"><option value="30 min">30 minutes</option><option value="45 min">45 minutes</option><option value="60 min">60 minutes</option><option value="90 min">90 minutes</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select name="type" value={newEvent.type} onChange={handleEventChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-3 focus:ring-blue-500/50"><option value="session">One-on-One Session</option><option value="class">Group Class</option><option value="availability">Available Slot</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label><textarea name="notes" value={newEvent.notes} onChange={handleEventChange} rows="2" placeholder="E.g. Focus on back & shoulders" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-3 focus:ring-blue-500/50"></textarea></div><div className="flex gap-3 pt-4">{isEditing && (<button type="button" onClick={deleteEvent} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition">Delete</button>)}<button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition">Cancel</button><button type="button" onClick={handleSaveEvent} className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-emerald-600 hover:to-green-600 text-white py-3 rounded-xl font-semibold transition shadow-md">{isEditing ? 'Update' : 'Add'} Session</button></div></form>)}</div></div>)}
    </div>
  );
}