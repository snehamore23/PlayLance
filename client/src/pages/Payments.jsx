import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Payments = () => {
  const { user } = useAuth();
  const isClient = user?.role === 'client';

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [paymentsError, setPaymentsError] = useState(null);

  const [myProjects, setMyProjects] = useState([]);
  const [acceptedProjectIds, setAcceptedProjectIds] = useState(new Set());
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [payingProjectId, setPayingProjectId] = useState(null);

  // Fetch real payments from GET /api/payments/my
  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      setPaymentsError(null);
      const response = await api.get('/payments/my');
      if (response.data && response.data.success) {
        setPayments(response.data.payments || []);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPaymentsError(
        err.response?.data?.message || 'Failed to load payments history.'
      );
    } finally {
      setLoadingPayments(false);
    }
  };

  // If client, fetch client's projects and check for accepted applications
  const fetchMyProjects = async () => {
    if (!isClient) return;
    try {
      setLoadingProjects(true);
      const response = await api.get('/projects/my');
      if (response.data && response.data.success) {
        const clientProjects = response.data.projects || [];
        setMyProjects(clientProjects);

        const acceptedSet = new Set();
        await Promise.all(
          clientProjects.map(async (p) => {
            try {
              const appRes = await api.get(`/projects/${p._id || p.id}/applications`);
              if (appRes.data && appRes.data.success) {
                const apps = appRes.data.applications || [];
                if (apps.some((a) => a.status === 'accepted')) {
                  acceptedSet.add(p._id || p.id);
                }
              }
            } catch (e) {
              // Ignore single project application fetch errors
            }
          })
        );
        setAcceptedProjectIds(acceptedSet);
      } else {
        setMyProjects([]);
      }
    } catch (err) {
      console.error('Error fetching my projects for payments:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    if (isClient) {
      fetchMyProjects();
    }
  }, [user?.role]);

  // Handle Pay Now for a project
  const handlePayNow = async (projectId) => {
    if (!projectId || payingProjectId) return;
    setPayingProjectId(projectId);

    try {
      const response = await api.post('/payments/create-checkout-session', { projectId });

      if (response.data && response.data.success) {
        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          toast.success('Checkout session created successfully');
          await fetchPayments();
          if (isClient) {
            await fetchMyProjects();
          }
        }
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPayingProjectId(null);
    }
  };

  // Helper calculation for summary cards
  const totalAmountPaidOrEarned = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const completedCount = payments.filter((p) => p.status === 'paid').length;
  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  const summaryCards = [
    {
      title: isClient ? 'Total Spent' : 'Total Earned',
      amount: `$${totalAmountPaidOrEarned.toLocaleString()}`,
      desc: isClient ? 'Total paid to freelancers' : 'Lifetime earnings on PayLance',
      icon: '💵',
    },
    {
      title: 'Completed Payments',
      amount: completedCount.toString(),
      desc: 'Successful transactions',
      icon: '✅',
    },
    {
      title: 'Pending Payments',
      amount: pendingCount.toString(),
      desc: 'Awaiting completion',
      icon: '⏳',
    },
    {
      title: 'Total Transactions',
      amount: payments.length.toString(),
      desc: 'All recorded payments',
      icon: '📊',
    },
  ];

  // Helper date formatter
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const paidProjectIds = new Set(
    payments.filter((p) => p.status === 'paid').map((p) => p.project?._id || p.project)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Payments & Earnings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage project payments, view transaction receipts, and track your {isClient ? 'expenditures' : 'earnings'}.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-black text-white">
                {card.amount}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Client Section: Pay for Projects */}
      {isClient && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">
                Project Payments
              </h2>
              <p className="text-xs text-slate-400">
                Pay for projects with an accepted freelancer using Stripe Checkout.
              </p>
            </div>
          </div>

          {loadingProjects ? (
            <div className="p-6 text-center text-xs text-slate-400 font-medium">
              Loading your projects...
            </div>
          ) : myProjects.length === 0 ? (
            <div className="p-6 bg-slate-950/60 rounded-xl text-center text-xs text-slate-400 border border-slate-800">
              You have no posted projects yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProjects.map((project) => {
                const pId = project._id || project.id;
                const isPaid = paidProjectIds.has(pId);
                const hasAcceptedFreelancer =
                  acceptedProjectIds.has(pId) || project.status === 'in-progress';

                return (
                  <div
                    key={pId}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 uppercase tracking-wider">
                          {project.status}
                        </span>
                        {isPaid && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                            Paid ✓
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2 line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-xs text-emerald-400 mt-1 font-semibold">
                        Budget: ${project.budget}
                      </p>
                    </div>

                    <div>
                      {isPaid ? (
                        <div className="w-full py-2 px-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-center text-xs font-bold text-emerald-300">
                          Payment Completed ✅
                        </div>
                      ) : hasAcceptedFreelancer ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handlePayNow(pId)}
                          disabled={payingProjectId === pId}
                          className="w-full"
                        >
                          {payingProjectId === pId ? 'Connecting to Stripe...' : 'Pay Now 💳'}
                        </Button>
                      ) : (
                        <div className="w-full py-2 px-3 rounded-lg bg-amber-950/60 border border-amber-800/60 text-center text-xs text-amber-300 font-semibold">
                          Awaiting accepted proposal
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Transaction History Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">
            Transaction History
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {payments.length} total transaction(s)
          </span>
        </div>

        {loadingPayments ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
            <p>Loading transactions...</p>
          </div>
        ) : paymentsError ? (
          <div className="p-6 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-center space-y-2 text-xs">
            <p className="font-semibold">{paymentsError}</p>
            <Button variant="outline" size="sm" onClick={fetchPayments}>
              Retry
            </Button>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="text-sm font-bold text-white">
              No transactions found.
            </p>
            <p className="text-xs">
              {isClient
                ? 'Payments you create for your projects will appear here.'
                : 'Payments received from clients will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">{isClient ? 'Freelancer' : 'Client'}</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {payments.map((p) => {
                  const projectTitle = p.project?.title || 'Project Payment';
                  const otherParty = isClient ? p.freelancer : p.client;
                  const otherPartyName = otherParty?.name || otherParty?.email || 'N/A';

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-mono text-xs font-bold text-emerald-400">
                        {p.transactionId || p._id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-xs sm:text-sm">
                          {projectTitle}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-300">
                        {otherPartyName}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-400">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            p.status === 'paid'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                              : p.status === 'pending'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-black text-sm text-emerald-400">
                        ${p.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;


