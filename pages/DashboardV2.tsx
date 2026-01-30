import React from 'react';

export const DashboardV2: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-text-main dark:text-white">Good Morning, Alex.</h1>
          <p className="text-text-muted dark:text-gray-400">Here is your financial snapshot for October 24, 2023.</p>
        </header>

        {/* Weekly Insight */}
        <section className="@container">
          <div className="flex flex-col items-stretch overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none dark:border dark:border-border-dark lg:flex-row transition-colors">
            <div className="h-48 w-full shrink-0 bg-cover bg-center lg:h-auto lg:w-64" style={{ backgroundImage: 'url("https://picsum.photos/400/300")' }}></div>
            <div className="flex grow flex-col justify-center gap-4 p-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted dark:text-gray-400">Weekly Insight</h3>
              </div>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <p className="max-w-xl text-lg font-medium leading-relaxed text-text-main dark:text-white">
                  You spent <span className="text-primary font-bold">15% less</span> on dining out this week compared to last. That's about $45 saved. Consider moving the surplus to your 'Travel' envelope?
                </p>
                <button className="shrink-0 cursor-pointer rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-[#111817] transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                  Move Surplus
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Holistic Overview */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-main dark:text-white">Holistic Overview</h2>
            <button className="text-sm font-medium text-text-muted hover:text-primary dark:text-gray-400 dark:hover:text-primary">View Report</button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark transition-colors">
              <div className="flex items-center gap-2 text-text-muted dark:text-gray-400">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
                <span className="text-sm font-medium">Net Worth</span>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold tracking-tight text-text-main dark:text-white">$124,500</p>
                <span className="mb-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">+2.4%</span>
              </div>
              <div className="mt-2 flex h-1 w-full gap-1">
                {[20, 40, 60, 80, 100].map(op => <div key={op} className={`h-full w-1/5 rounded-full bg-primary/${op === 100 ? '' : op}`}></div>)}
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark transition-colors">
              <div className="flex items-center gap-2 text-text-muted dark:text-gray-400">
                <span className="material-symbols-outlined text-[20px]">trending_up</span>
                <span className="text-sm font-medium">Assets</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-text-main dark:text-white">$450,000</p>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark transition-colors">
              <div className="flex items-center gap-2 text-text-muted dark:text-gray-400">
                <span className="material-symbols-outlined text-[20px]">trending_down</span>
                <span className="text-sm font-medium">Liabilities</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-text-main dark:text-white">$325,500</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          {/* Envelope System */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-main dark:text-white">The Envelope System</h2>
              <button className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Distribute Funds
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { icon: "shopping_cart", color: "blue", name: "Essentials", sub: "Groceries, Rent", val: "$850", tot: "$2,000", pct: "57%" },
                { icon: "restaurant", color: "purple", name: "Lifestyle", sub: "Dining, Entertainment", val: "$240", tot: "$600", pct: "60%" },
                { icon: "flight", color: "teal", name: "Goal Savings", sub: "Travel, Emergency", val: "$950", tot: "$1,200", pct: "80%" }
              ].map((e, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl border border-border-light bg-surface-light p-5 shadow-sm transition-all hover:shadow-md dark:border-border-dark dark:bg-surface-dark">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${e.color}-50 text-${e.color}-600 dark:bg-${e.color}-900/20 dark:text-${e.color}-400`}>
                        <span className="material-symbols-outlined">{e.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-text-main dark:text-white">{e.name}</p>
                        <p className="text-xs text-text-muted dark:text-gray-400">{e.sub}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-text-main dark:text-white">{e.val} left</p>
                      <p className="text-xs text-text-muted dark:text-gray-400">of {e.tot}</p>
                    </div>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-background-light dark:bg-background-dark/50">
                    <div className={`absolute left-0 top-0 h-full rounded-full bg-${e.color === 'teal' ? 'primary' : e.color + '-500'}`} style={{ width: e.pct }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Goal Horizon */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-text-main dark:text-white">Goal Horizon</h2>
            <div className="flex flex-1 flex-col justify-between rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark transition-colors">
              <p className="text-sm text-text-muted dark:text-gray-400 mb-6">Drag the slider to see how increasing your monthly contribution affects your goal dates.</p>
              <div className="relative mt-8 h-32 w-full px-4">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-border-light dark:bg-border-dark"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-4 border-surface-light bg-text-muted dark:border-surface-dark"></div>
                  <span className="text-xs font-bold text-text-muted">Now</span>
                </div>
                {[
                  { left: "25%", icon: "directions_car", color: "text-blue-500", label: "New Car", date: "Oct 2025" },
                  { left: "55%", icon: "home", color: "text-primary", label: "House", date: "May 2028" },
                  { left: "100%", icon: "beach_access", color: "text-purple-500", label: "Retire", date: "2045" }
                ].map((g, i) => (
                  <div key={i} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2" style={{ left: g.left, transform: g.left === "100%" ? "translate(-100%, -50%)" : "translate(-50%, -50%)" }}>
                    <div className="relative z-10 flex h-10 w-10 -translate-y-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 dark:bg-surface-dark dark:border-border-dark">
                      <span className={`material-symbols-outlined text-[20px] ${g.color}`}>{g.icon}</span>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-bold text-text-main dark:text-white">{g.label}</p>
                      <p className="text-[10px] text-text-muted">{g.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-background-light p-4 dark:bg-background-dark/50 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-text-muted">Monthly Contribution</span>
                  <span className="text-lg font-bold text-primary">$1,250</span>
                </div>
                <input className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary dark:bg-gray-700" max="5000" min="500" type="range" defaultValue="1250" />
                <div className="mt-2 flex justify-between text-xs text-text-muted">
                  <span>$500</span>
                  <span>$5,000</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};