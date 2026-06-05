import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function StatCard({ label, value, sub, icon, gradient, iconBg }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} border border-white/5`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">{label}</p>
          <p className="text-2xl font-black text-white truncate">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/invoices')
      .then(res => setInvoices(res.data.invoices))
      .finally(() => setLoading(false));
  }, []);

  const pending = invoices.filter(i => i.status === 'pending');
  const paid = invoices.filter(i => i.status === 'paid');
  const overdue = invoices.filter(i => i.status === 'overdue');
  const outstanding = [...pending, ...overdue].reduce((s, i) => s + i.amount, 0);
  const paidAmount = paid.reduce((s, i) => s + i.amount, 0);
  const total = invoices.length;
  const collectionRate = total > 0 ? Math.round((paid.length / total) * 100) : 0;
  const recent = invoices.slice(0, 8);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 p-6 lg:p-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-slate-500 text-sm mb-0.5">{greeting()},</p>
            <h1 className="text-2xl font-black text-white">{user?.name || 'Welcome back'}</h1>
          </div>
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Invoice
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Total Invoices"
                value={total}
                sub={total === 1 ? '1 invoice' : total + ' invoices total'}
                gradient="bg-slate-900"
                iconBg="bg-indigo-500/15"
                icon={<svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              />
              <StatCard
                label="Outstanding"
                value={'&#8377;' + outstanding.toLocaleString('en-IN')}
                sub={(pending.length + overdue.length) + ' unpaid invoices'}
                gradient="bg-slate-900"
                iconBg="bg-amber-500/15"
                icon={<svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard
                label="Collected"
                value={'&#8377;' + paidAmount.toLocaleString('en-IN')}
                sub={paid.length + ' invoices paid'}
                gradient="bg-slate-900"
                iconBg="bg-green-500/15"
                icon={<svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard
                label="Overdue"
                value={overdue.length}
                sub={overdue.length > 0 ? 'Needs your attention' : 'All clear'}
                gradient="bg-slate-900"
                iconBg="bg-red-500/15"
                icon={<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
              />
            </div>

            {/* COLLECTION RATE BAR */}
            {total > 0 && (
              <div className="bg-slate-900 border border-white/5 rounded-2xl px-6 py-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-300">Collection rate</p>
                  <span className="text-sm font-bold text-white">{collectionRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                    style={{ width: collectionRate + '%' }}
                  />
                </div>
                <div className="flex justify-between mt-2.5">
                  <span className="text-xs text-slate-600">{paid.length} paid</span>
                  <span className="text-xs text-slate-600">{total - paid.length} remaining</span>
                </div>
              </div>
            )}

            {/* RECENT INVOICES */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h2 className="font-bold text-white">Recent Invoices</h2>
                <Link to="/invoices" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1">
                  View all
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {recent.length === 0 ? (
                <div className="py-20 text-center px-6">
                  <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 font-medium mb-1">No invoices yet</p>
                  <p className="text-slate-600 text-sm mb-5">Create your first invoice to get started</p>
                  <Link
                    to="/invoices/new"
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create invoice
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {recent.map(inv => (
                    <Link
                      key={inv._id}
                      to={'/invoices/' + inv._id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-400">
                          {inv.clientName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm truncate">{inv.clientName}</p>
                          <p className="text-xs text-slate-500 truncate">{inv.clientEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                        <div className="text-right hidden sm:block">
                          <p className="font-bold text-white text-sm">&#8377;{inv.amount.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-slate-500">Due {new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        </div>
                        <StatusBadge status={inv.status} />
                        <svg className="w-4 h-4 text-slate-700 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
