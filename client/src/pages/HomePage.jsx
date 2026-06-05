import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    color: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20',
    iconColor: 'text-indigo-400',
    icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.096.038a2.25 2.25 0 002.652-.436l.296-.295a2.25 2.25 0 013.182 0l.296.295a2.25 2.25 0 002.652.436l.096-.038A2.25 2.25 0 0121 14.818V9.104a2.25 2.25 0 00-.659-1.591L17 4.5',
    title: 'AI Reminder Generation',
    desc: 'GPT-4o mini writes a personalised, firm-but-polite reminder for every invoice ? tailored to the client name, amount, and days overdue.',
  },
  {
    color: 'from-violet-500/20 to-violet-500/5 border-violet-500/20',
    iconColor: 'text-violet-400',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    title: 'Live Dashboard',
    desc: 'See outstanding balance, paid invoices, and overdue counts at a glance. Your collection rate tracked in real time.',
  },
  {
    color: 'from-amber-500/20 to-amber-500/5 border-amber-500/20',
    iconColor: 'text-amber-400',
    icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
    title: 'Reminder Tracking',
    desc: 'Every invoice shows exactly how many reminders were sent, so you know who needs another nudge and who needs space.',
  },
  {
    color: 'from-green-500/20 to-green-500/5 border-green-500/20',
    iconColor: 'text-green-400',
    icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
    title: 'Secure by Default',
    desc: 'JWT auth, bcrypt hashing, and strict per-user data isolation. Nobody else can ever see your invoices.',
  },
  {
    color: 'from-sky-500/20 to-sky-500/5 border-sky-500/20',
    iconColor: 'text-sky-400',
    icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
    title: 'Inline Editing',
    desc: 'Update any invoice field directly in the detail view. Flip status from pending to paid with a single click.',
  },
  {
    color: 'from-rose-500/20 to-rose-500/5 border-rose-500/20',
    iconColor: 'text-rose-400',
    icon: 'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z',
    title: 'Smart Filters',
    desc: 'Filter by pending, paid, or overdue instantly. See only what needs your attention right now.',
  },
];

const STEPS = [
  { n: '1', color: 'bg-indigo-500', title: 'Create an invoice', desc: 'Add client name, email, amount, and due date in 30 seconds.' },
  { n: '2', color: 'bg-violet-500', title: 'Generate a reminder', desc: 'AI writes a tailored, professional message for your client.' },
  { n: '3', color: 'bg-green-500', title: 'Mark it paid', desc: 'When payment arrives, flip to Paid. Dashboard updates instantly.' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight">CollectAI</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
                  Sign in
                </Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-36 pb-24 px-6">
        {/* background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium px-3.5 py-1.5 rounded-full mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Powered by GPT-4o mini
            </div>

            <h1 className="text-5xl sm:text-6xl font-black leading-[1.08] tracking-tight mb-6">
              Stop chasing.<br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Start collecting.
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-9 max-w-lg">
              CollectAI tracks your invoices and generates personalised AI payment reminders ? so you spend less time chasing clients and more time growing your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-sm shadow-xl shadow-indigo-500/25">
                Start free today
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-7 py-3.5 rounded-xl transition-all text-sm">
                Sign in
              </Link>
            </div>

            <div className="flex items-center gap-8">
              {[['Free', 'to start'], ['AI', 'powered'], ['100%', 'private']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-xl font-bold text-white">{v}</div>
                  <div className="text-slate-500 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT ? mock invoice card */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 rounded-3xl blur-xl" />
            <div className="relative bg-slate-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-2xl">
              {/* mini header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Invoice #1042</p>
                  <p className="font-semibold text-white">Rahul Sharma</p>
                </div>
                <span className="text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">Pending</span>
              </div>
              <div className="flex items-end justify-between mb-5 pb-5 border-b border-white/5">
                <div>
                  <p className="text-slate-500 text-xs mb-1">Amount due</p>
                  <p className="text-3xl font-black text-white">&#8377;24,500</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs mb-1">Due date</p>
                  <p className="text-sm font-medium text-red-400">3 days overdue</p>
                </div>
              </div>
              {/* AI reminder */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-indigo-500/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-indigo-300">AI Generated Reminder</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  "Hi Rahul, I hope you're doing well. This is a gentle reminder that invoice #1042 for &#8377;24,500 was due 3 days ago. Could you please arrange payment at your earliest convenience? Thank you!"
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-indigo-600 text-white text-xs font-medium py-1.5 rounded-lg">Copy</button>
                  <button className="flex-1 bg-white/5 text-slate-300 text-xs font-medium py-1.5 rounded-lg border border-white/10">Regenerate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl font-black mb-4">Everything to collect faster</h2>
            <p className="text-slate-400 max-w-lg mx-auto">No spreadsheets. No chasing. Just smart tools that work while you focus on delivering great work.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className={`bg-gradient-to-br ${f.color} border rounded-2xl p-6 hover:scale-[1.02] transition-transform`}>
                <svg className={`w-7 h-7 mb-4 ${f.iconColor}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl font-black mb-16">Up and running in 3 steps</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative bg-slate-900/50 border border-white/5 rounded-2xl p-7 hover:border-white/10 transition-colors">
                <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center text-white font-black text-sm mb-5 shadow-lg`}>
                  {s.n}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-11 -right-3 w-6 h-px bg-slate-700 z-10" />
                )}
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl blur-2xl opacity-30" />
          <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-14 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to get paid faster?</h2>
              <p className="text-indigo-100 mb-8 text-base max-w-md mx-auto">Create your free account. No credit card required. Start sending AI reminders in minutes.</p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors shadow-xl"
              >
                Create free account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </div>
            <span className="font-bold text-sm text-white">CollectAI</span>
          </div>
          <p className="text-slate-600 text-sm">AI-powered invoice collection for freelancers and small businesses.</p>
          <div className="flex gap-5">
            <Link to="/login" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Sign in</Link>
            <Link to="/register" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
