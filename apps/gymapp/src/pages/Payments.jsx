// src/pages/Payments.jsx
import { useState, useMemo, useEffect } from 'react';

export default function Payments() {
  const [filter, setFilter] = useState('this-month');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([
    { id: 1, client: 'Sarah Johnson', plan: 'Premium', amount: 120, date: '2024-08-20', status: 'paid', method: 'Card', transactionId: 'txn_sj_928374' },
    { id: 2, client: 'Mike Chen', plan: 'Basic', amount: 60, date: '2024-08-18', status: 'paid', method: 'PayPal', transactionId: 'txn_mc_882211' },
    { id: 3, client: 'Lisa Wong', plan: 'Premium', amount: 120, date: '2024-08-15', status: 'paid', method: 'Card', transactionId: 'txn_lw_773322' },
    { id: 4, client: 'Alex Rivera', plan: 'Elite', amount: 200, date: '2024-08-10', status: 'pending', method: 'Bank Transfer', transactionId: 'txn_ar_123456' },
    { id: 5, client: 'Emma Thompson', plan: 'Premium', amount: 120, date: '2024-08-05', status: 'paid', method: 'Card', transactionId: 'txn_et_445566' },
    { id: 6, client: 'David Kim', plan: 'Basic', amount: 60, date: '2024-07-28', status: 'failed', method: 'Card', transactionId: 'txn_dk_778899' },
  ]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];
    const now = new Date();
    if (filter === 'this-week') {
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      filtered = filtered.filter((p) => new Date(p.date) >= lastWeek);
    } else if (filter === 'this-month') {
      filtered = filtered.filter((p) => {
        const pDate = new Date(p.date);
        return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
      });
    } else if (filter === 'last-month') {
      const lastMonth = new Date(now);
      lastMonth.setMonth(now.getMonth() - 1);
      filtered = filtered.filter((p) => {
        const pDate = new Date(p.date);
        return pDate.getMonth() === lastMonth.getMonth() && pDate.getFullYear() === lastMonth.getFullYear();
      });
    }
    if (searchTerm) {
      filtered = filtered.filter((p) => p.client.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filtered;
  }, [filter, searchTerm, payments]);

  const totals = useMemo(() => {
    const total = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const paid = filteredPayments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pending = filteredPayments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    return { total, paid, pending };
  }, [filteredPayments]);

  const exportToCSV = () => { /* ... unchanged ... */ };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      setTimeout(() => {
        const newPayment = { id: Date.now(), client: 'New Client', plan: 'Premium', amount: 120, date: new Date().toISOString().slice(0, 10), status: 'paid', method: 'Card', transactionId: `txn_${Math.random().toString(36).substr(2, 9)}` };
        setPayments((prev) => [newPayment, ...prev]);
        setLoading(false);
      }, 1000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-800">💳 Payments</h1><p className="text-gray-600 mt-2">View your earnings, payment history, and client transactions</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/30 text-center transform-hover"><div className="text-2xl font-bold text-emerald-600">${totals.paid}</div><div className="text-sm text-gray-500 mt-1">Paid This Period</div><div className="w-8 h-1 bg-emerald-500 rounded-full mt-2 mx-auto"></div></div>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/30 text-center transform-hover"><div className="text-2xl font-bold text-orange-500">${totals.pending}</div><div className="text-sm text-gray-500 mt-1">Pending</div><div className="w-8 h-1 bg-orange-400 rounded-full mt-2 mx-auto"></div></div>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/30 text-center transform-hover"><div className="text-2xl font-bold text-gray-800">${totals.total}</div><div className="text-sm text-gray-500 mt-1">Total Collected</div><div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-emerald-600 rounded-full mt-2 mx-auto"></div></div>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/30 text-center transform-hover"><div className="text-2xl font-bold text-red-500">{payments.filter((p) => p.status === 'failed').length}</div><div className="text-sm text-gray-500 mt-1">Failed Payments</div><div className="w-8 h-1 bg-red-400 rounded-full mt-2 mx-auto"></div></div>
      </div>
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/30 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1"><div className="relative flex-1"><span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span><input type="text" placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 bg-white" /></div><select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 bg-white"><option value="all">All Time</option><option value="this-week">This Week</option><option value="this-month">This Month</option><option value="last-month">Last Month</option></select></div>
        <button onClick={exportToCSV} className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-2 transform-hover">📤 Export CSV</button>
      </div>
      {loading && (<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in"><div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/30 transform hover:scale-105 transition"><div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div><p className="mt-4 text-gray-600">New payment received!</p></div></div>)}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-white/40"><tr className="text-sm font-semibold text-gray-700"><th className="py-5 px-6 text-left tracking-wide"><div className="flex items-center gap-2"><span className="text-blue-600">👤</span><span>Client</span></div></th><th className="py-5 px-6 text-left tracking-wide"><div className="flex items-center gap-2"><span className="text-indigo-600">🎯</span><span>Plan</span></div></th><th className="py-5 px-6 text-left tracking-wide"><div className="flex items-center gap-2"><span className="text-emerald-600">💰</span><span>Amount</span></div></th><th className="py-5 px-6 text-left tracking-wide"><div className="flex items-center gap-2"><span className="text-purple-600">📅</span><span>Date</span></div></th><th className="py-5 px-6 text-left tracking-wide"><div className="flex items-center gap-2"><span>✅</span><span>Status</span></div></th><th className="py-5 px-6 text-left tracking-wide"><div className="flex items-center gap-2"><span className="text-orange-600">💳</span><span>Method</span></div></th><th className="py-5 px-6 text-left tracking-wide"><div className="flex items-center gap-2"><span className="text-gray-600">🔢</span><span>ID</span></div></th></tr></thead><tbody className="divide-y divide-white/10">{filteredPayments.length === 0 ? (<tr><td colSpan="7" className="text-center py-16 text-gray-500"><div className="text-5xl mb-4 animate-pulse">🔍</div><p className="text-lg font-medium">No payments found</p><p className="text-sm">Try adjusting your search or filter.</p></td></tr>) : (filteredPayments.map((payment) => (<tr key={payment.id} className="hover:bg-white/40 transition-all duration-200 cursor-pointer group"><td className="py-4 px-6 font-medium text-gray-800">{payment.client}</td><td className="py-4 px-6"><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${payment.plan === 'Elite' ? 'bg-purple-100 text-purple-800' : payment.plan === 'Premium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>{payment.plan}</span></td><td className="py-4 px-6 font-semibold text-gray-800">${payment.amount}</td><td className="py-4 px-6 text-gray-600">{formatDate(payment.date)}</td><td className="py-4 px-6"><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${payment.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : payment.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>{payment.status === 'paid' && '✅ Paid'}{payment.status === 'pending' && '⏳ Pending'}{payment.status === 'failed' && '❌ Failed'}</span></td><td className="py-4 px-6 text-gray-600">{payment.method}</td><td className="py-4 px-6 text-xs text-gray-500 font-mono">{payment.transactionId.slice(-6)}</td></tr>)))}</tbody></table></div>
      </div>
      <div className="mt-8 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/30 text-sm text-gray-600">
        <p>Showing <span className="font-bold text-gray-800">{filteredPayments.length}</span> of <span className="font-bold text-gray-800">{payments.length}</span> transactions • <span className="font-medium text-emerald-600">{payments.filter(p => p.status === 'paid').length} paid</span></p>
      </div>
    </div>
  );
}