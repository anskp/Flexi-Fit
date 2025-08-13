// src/pages/Clients.jsx
import { useState, useMemo, useEffect } from 'react';
import * as trainerService from '../api/trainerService'; // Assuming you have this service
import parseApiError from '../utils/parseApiError';

export default function Clients() {
  // ✅ SOLUTION: Initialize state with an empty array `[]`
  const [clients, setClients] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Fetch real client data from the backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await trainerService.getMySubscribers();
        if (response.success) {
          // Map the backend data to the structure the component expects
          const formattedClients = response.data.map(sub => ({
            id: sub.user.id,
            name: sub.user.memberProfile?.name || sub.user.email,
            avatar: (sub.user.memberProfile?.name || sub.user.email).charAt(0).toUpperCase(),
            email: sub.user.email,
            plan: sub.trainerPlan.name,
            joinDate: sub.startDate,
            status: sub.status,
            // Placeholders for data we will add later
            sessionsThisWeek: 0, 
            progress: 0, 
            lastActive: 'N/A',
          }));
          setClients(formattedClients);
        }
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []); // Empty array ensures this runs only once on mount


  const plans = useMemo(() => ['all', ...Array.from(new Set(clients.map(c => c.plan)))], [clients]);

  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients]; // Make a copy to avoid mutating state

    if (searchTerm) {
        result = result.filter((client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filterPlan !== 'all') {
      result = result.filter((client) => client.plan === filterPlan);
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'sessions') return b.sessionsThisWeek - a.sessionsThisWeek;
      return 0;
    });

    return result;
  }, [searchTerm, filterPlan, sortBy, clients]);

  // --- UI State Handling ---

  if (loading) {
      return <div className="text-center p-8">Loading Clients...</div>;
  }

  if (error) {
      return <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">👥 Clients</h1>
        <p className="text-gray-600 mt-2">Manage, track, and grow your client relationships</p>
      </div>

      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/30 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">🔍 Search</label>
            <input type="text" placeholder="Name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🎯 Plan</label>
            <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
              {plans.map((plan) => (<option key={plan} value={plan}>{plan === 'all' ? 'All Plans' : plan}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📊 Sort</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
              <option value="name">Name</option>
              <option value="progress">Progress</option>
              <option value="sessions">Sessions</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {filteredAndSortedClients.length === 0 ? (
          <div className="text-center py-16"><div className="text-6xl mb-4">🤷</div><h3 className="text-xl font-semibold text-gray-700">No clients found</h3><p className="text-gray-500 mt-2">{clients.length > 0 ? 'Try adjusting your search or filter.' : 'You currently have no active subscribers.'}</p></div>
        ) : (
          filteredAndSortedClients.map((client) => (
            <div key={client.id} className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/30">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-emerald-600 text-white flex items-center justify-center font-bold shadow-lg">{client.avatar}</div>
                  <div className="min-w-0 flex-1"><h3 className="font-bold text-lg text-gray-800">{client.name}</h3><div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-500"><span>{client.email}</span><span>•</span><span>📅 Joined <b>{new Date(client.joinDate).toLocaleDateString()}</b></span></div></div>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 min-w-fit">
                  <div className="text-center"><div className="text-sm text-gray-500">Plan</div><span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${client.plan === 'Elite' ? 'bg-purple-100 text-purple-800' : client.plan === 'Premium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>{client.plan}</span></div>
                  <div className="text-center"><div className="text-sm text-gray-500">Status</div><span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{client.status}</span></div>
                  <div className="flex gap-2"><button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Message</button><button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">View</button></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 bg-white/90 backdrop-blur-sm p-5 rounded-3xl shadow-lg border border-white/30 text-sm text-gray-600">
        <p>Showing <b>{filteredAndSortedClients.length}</b> of <b>{clients.length}</b> clients • <span className="text-green-600 font-medium">{clients.filter(c => c.status === 'active').length} active</span></p>
      </div>
    </div>
  );
}