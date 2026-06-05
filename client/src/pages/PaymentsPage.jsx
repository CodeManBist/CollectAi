import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';

const TABS = [
  { key: 'unpaid', label: 'Needs Payment' },
  { key: 'paid',   label: 'Paid'          },
  { key: 'all',    label: 'All'           },
];

export default function PaymentsPage() {
  const [invoices, setInvoices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('unpaid');
  const [markingId, setMarkingId] = useState(null);
  const [copiedId, setCopiedId]   = useState(null);

  useEffect(() => {
    api.get('/invoices')
      .then(res => setInvoices(res.data.invoices))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkPaid = async (inv) => {
    setMarkingId(inv._id);
    try {
      const res = await api.put('/invoices/' + inv._id, {
        clientName:  inv.clientName,
        clientEmail: inv.clientEmail,
        amount:      inv.amount,
        dueDate:     inv.dueDate.split('T')[0],
        description: inv.description || '',
        paymentLink: inv.paymentLink || '',
        status:      'paid',
      });
      setInvoices(prev => prev.map(i => i._id === inv._id ? res.data.invoice : i));
    } catch {
      alert('Failed to update');
    } finally {
      setMarkingId(null);
    }
  };

  const handleCopy = (inv) => {
    navigator.clipboard.writeText(inv.paymentLink);
    setCopiedId(inv._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // derived
  const pending  = invoices.filter(i => i.status === 'pending');
  const overdue  = invoices.filter(i => i.status === 'overdue');
  const paid     = invoices.filter(i => i.status === 'paid');
  const unpaid   = [...overdue, ...pending];          // overdue first

  const outstanding = unpaid.reduce((s, i) => s + i.amount, 0);
  const collected   = paid.reduce((s, i) => s + i.amount, 0);

  const tabData = { unpaid, paid, all: invoices };
  const rows    = tabData[tab] || [];

  const counts = { unpaid: unpaid.length, paid: paid.length, all: invoices.length };

  const daysLabel = (inv) => {
    if (inv.status === 'paid') return null;
    const diff = Math.ceil((new Date(inv.dueDate) - new Date()) / 86400000);
    if (diff < 0)  return { text: `${Math.abs(diff)}d overdue`, cls: 'text-red-400' };
    if (diff === 0) return { text: 'Due today',                  cls: 'text-amber-400' };
    return              { text: `in ${diff}d`,                   cls: 'text-slate-500' };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 p-6 lg:p-8">

        {/* PAGE HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Payments</h1>
            <p className="text-slate-500 text-sm mt-1">All invoices that need to be paid or have been collected</p>
          </div>
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Invoice
          </Link>
        </div>

        {/* SUMMARY STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SumCard
            label="Outstanding"
            value={'₹' + outstanding.toLocaleString('en-IN')}
            sub={unpaid.length + ' unpaid'}
            color="text-amber-400"
            bg="bg-amber-500/10"
            border="border-amber-500/20"
          />
          <SumCard
            label="Collected"
            value={'₹' + collected.toLocaleString('en-IN')}
            sub={paid.length + ' invoices'}
            color="text-green-400"
            bg="bg-green-500/10"
            border="border-green-500/20"
          />
          <SumCard
            label="Overdue"
            value={overdue.length}
            sub={overdue.length > 0 ? '₹' + overdue.reduce((s,i)=>s+i.amount,0).toLocaleString('en-IN') + ' at risk' : 'All clear'}
            color="text-red-400"
            bg="bg-red-500/10"
            border="border-red-500/20"
          />
          <SumCard
            label="Collection Rate"
            value={(invoices.length > 0 ? Math.round((paid.length / invoices.length) * 100) : 0) + '%'}
            sub={paid.length + ' / ' + invoices.length + ' invoices'}
            color="text-indigo-400"
            bg="bg-indigo-500/10"
            border="border-indigo-500/20"
          />
        </div>

        {/* TABS */}
        <div className="flex items-center gap-1 bg-slate-900 border border-white/5 rounded-xl p-1 mb-6 w-fit">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                tab === t.key ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'
              }`}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
            {/* TABLE HEAD */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1.6fr] gap-4 px-5 py-3 border-b border-white/5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <span>Client</span>
              <span>Amount</span>
              <span>Due Date</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            {/* TABLE ROWS */}
            <div className="divide-y divide-white/5">
              {rows.map(inv => {
                const dl = daysLabel(inv);
                return (
                  <div
                    key={inv._id}
                    className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1.6fr] gap-4 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* CLIENT */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold border ${
                        inv.status === 'paid'    ? 'bg-green-500/10  text-green-400  border-green-500/20'
                        : inv.status === 'overdue' ? 'bg-red-500/10    text-red-400    border-red-500/20'
                        :                           'bg-amber-500/10  text-amber-400  border-amber-500/20'
                      }`}>
                        {inv.clientName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{inv.clientName}</p>
                        <p className="text-xs text-slate-500 truncate">{inv.clientEmail}</p>
                      </div>
                    </div>

                    {/* AMOUNT */}
                    <div>
                      <p className="font-black text-white text-sm">&#8377;{inv.amount.toLocaleString('en-IN')}</p>
                    </div>

                    {/* DUE DATE */}
                    <div>
                      <p className="text-sm text-slate-300">
                        {new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </p>
                      {dl && <p className={`text-xs mt-0.5 ${dl.cls}`}>{dl.text}</p>}
                    </div>

                    {/* STATUS */}
                    <div>
                      <StatusBadge status={inv.status} />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 md:justify-end flex-wrap">
                      {/* Payment link */}
                      {inv.paymentLink ? (
                        <>
                          <button
                            onClick={() => handleCopy(inv)}
                            className="flex items-center gap-1.5 text-xs border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            {copiedId === inv._id ? (
                              <><svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-green-400">Copied</span></>
                            ) : (
                              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy link</>
                            )}
                          </button>
                          <a
                            href={inv.paymentLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs border border-indigo-500/30 hover:border-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Pay now
                          </a>
                        </>
                      ) : (
                        <Link
                          to={'/invoices/' + inv._id}
                          className="text-xs border border-dashed border-white/10 hover:border-white/20 text-slate-500 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          + Add pay link
                        </Link>
                      )}

                      {/* Mark paid */}
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkPaid(inv)}
                          disabled={markingId === inv._id}
                          className="flex items-center gap-1.5 text-xs border border-green-500/30 hover:border-green-400 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
                        >
                          {markingId === inv._id ? (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          Mark paid
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TABLE FOOTER */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-slate-600">{rows.length} {rows.length === 1 ? 'invoice' : 'invoices'}</p>
              {tab === 'unpaid' && outstanding > 0 && (
                <p className="text-xs text-amber-500 font-semibold">
                  &#8377;{outstanding.toLocaleString('en-IN')} total outstanding
                </p>
              )}
              {tab === 'paid' && collected > 0 && (
                <p className="text-xs text-green-500 font-semibold">
                  &#8377;{collected.toLocaleString('en-IN')} total collected
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function SumCard({ label, value, sub, color, bg, border }) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-5`}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-slate-600 mt-1">{sub}</p>
    </div>
  );
}

function EmptyState({ tab }) {
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl py-20 text-center">
      <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <p className="text-slate-400 font-medium mb-1">
        {tab === 'unpaid' ? 'No outstanding payments' : tab === 'paid' ? 'No payments collected yet' : 'No invoices found'}
      </p>
      <p className="text-slate-600 text-sm mb-5">
        {tab === 'unpaid' ? 'All invoices are paid up.' : 'Create an invoice to get started.'}
      </p>
      {tab !== 'unpaid' && (
        <Link
          to="/invoices/new"
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create invoice
        </Link>
      )}
    </div>
  );
}
