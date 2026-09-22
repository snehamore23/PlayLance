import React from 'react';
import Button from '../components/Button';

const Payments = () => {
  const summaryCards = [
    {
      title: 'Available Balance',
      amount: '$4,850.00',
      desc: 'Ready for instant payout',
      icon: '💵',
    },
    {
      title: 'In Escrow Protection',
      amount: '$3,200.00',
      desc: 'Secured for active milestones',
      icon: '🔒',
    },
    {
      title: 'Total Earned',
      amount: '$24,600.00',
      desc: 'Lifetime earnings on PayLance',
      icon: '📈',
    },
    {
      title: 'Pending Clearance',
      amount: '$1,200.00',
      desc: 'Releases in 2-3 business days',
      icon: '⏳',
    },
  ];

  const transactions = [
    {
      id: 'TXN-98421',
      project: 'Full-Stack React & Node.js Developer for SaaS MVP',
      milestone: 'Milestone 2: REST API & DB Migration',
      date: 'Sep 21, 2026',
      amount: '+$1,200.00',
      type: 'Milestone Release',
      status: 'Completed',
    },
    {
      id: 'TXN-98420',
      project: 'UI/UX Redesign for AI Analytics Platform',
      milestone: 'Milestone 1: Figma Prototype Delivery',
      date: 'Sep 15, 2026',
      amount: '+$850.00',
      type: 'Milestone Release',
      status: 'Completed',
    },
    {
      id: 'TXN-98419',
      project: 'Withdrawal to Bank Account (****4821)',
      milestone: 'ACH Direct Deposit',
      date: 'Sep 10, 2026',
      amount: '-$2,500.00',
      type: 'Withdrawal',
      status: 'Processing',
    },
    {
      id: 'TXN-98418',
      project: 'Cross-Platform Mobile App for Logistics',
      milestone: 'Initial Deposit in Escrow',
      date: 'Sep 02, 2026',
      amount: '$3,000.00',
      type: 'Escrow Funded',
      status: 'In Escrow',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payments & Earnings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your PayLance wallet, escrow milestones, and payout history.
          </p>
        </div>

        <Button variant="primary" size="md">
          Withdraw Funds 💳
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {card.amount}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Transactions
          </h2>
          <span className="text-xs text-slate-400">Showing last 4 transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                  <td className="py-4 px-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {t.project}
                    </div>
                    <div className="text-xs text-slate-500">{t.milestone}</div>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500">
                    {t.date}
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {t.type}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        t.status === 'Completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : t.status === 'Processing'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className={`py-4 px-4 text-right font-extrabold text-sm ${
                    t.amount.startsWith('-') ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {t.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
