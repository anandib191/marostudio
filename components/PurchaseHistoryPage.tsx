import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface HistoryEntry {
  index: number;
  date: string;
  action: 'purchase' | 'payment_failed';
  planName: string;
  billingPeriod: 'monthly' | 'yearly' | null;
  totalCredits: number | null;
  reason: string | null;
  errorCode: string | null;
  orderId: string | null;
  razorpayPaymentId: string | null;
  amount: number | null;
  promoCode: string | null;
  promoDiscount: number | null;
  originalAmount: number | null;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const openInvoice = (entry: HistoryEntry, userName: string | null, userEmail: string | null, invoiceIndex: number) => {
  const invoiceNumber = `MS-${new Date(entry.date).getFullYear()}-${String(invoiceIndex + 1).padStart(4, '0')}`;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Invoice ${invoiceNumber} - MaroStudio</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 40px; max-width: 700px; margin: auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #e6b71e; padding-bottom: 20px; margin-bottom: 30px; }
  .brand { font-size: 28px; font-weight: 800; color: #e6b71e; letter-spacing: 1px; }
  .brand span { color: #111; }
  .invoice-meta { text-align: right; }
  .invoice-meta h2 { font-size: 22px; color: #222; margin-bottom: 6px; }
  .invoice-meta p { font-size: 13px; color: #666; }
  .section { margin-bottom: 28px; }
  .section h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 8px; }
  .section p { font-size: 15px; color: #222; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background: #f8f1d8; color: #7a5c00; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 10px 14px; text-align: left; }
  td { padding: 12px 14px; border-bottom: 1px solid #f0e9d0; font-size: 14px; }
  .total-row td { font-weight: 700; font-size: 16px; background: #fffbed; border-bottom: none; }
  .status-badge { display: inline-block; background: #22c55e; color: #fff; font-size: 11px; padding: 2px 10px; border-radius: 20px; font-weight: 600; }
  .footer { text-align: center; color: #aaa; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 16px; }
  @media print {
    body { padding: 20px; }
    button { display: none !important; }
  }
</style>
</head>
<body>
<div class="header">
  <div class="brand">MARO<span>Studio</span></div>
  <div class="invoice-meta">
    <h2>INVOICE</h2>
    <p><strong>${invoiceNumber}</strong></p>
    <p>${formatDate(entry.date)}</p>
    <span class="status-badge">PAID</span>
  </div>
</div>

<div class="section">
  <h3>Bill To</h3>
  <p><strong>${userName || 'Customer'}</strong></p>
  <p>${userEmail || ''}</p>
</div>

${entry.razorpayPaymentId ? `<div class="section"><h3>Payment Reference</h3><p>Payment ID: <strong>${entry.razorpayPaymentId}</strong></p>${entry.orderId ? `<p>Order ID: ${entry.orderId}</p>` : ''}</div>` : ''}


<table>
  <thead>
    <tr>
      <th>Description</th>
      <th>Billing</th>
      <th>Credits</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${entry.planName} Plan Subscription</td>
      <td>${entry.billingPeriod ? entry.billingPeriod.charAt(0).toUpperCase() + entry.billingPeriod.slice(1) : '—'}</td>
      <td>${entry.totalCredits?.toLocaleString() ?? '—'}</td>
      <td>${entry.originalAmount ? '₹' + entry.originalAmount.toLocaleString('en-IN') : entry.amount ? '₹' + entry.amount.toLocaleString('en-IN') : '—'}</td>
    </tr>
    ${entry.promoCode && entry.promoDiscount ? `
    <tr>
      <td colspan="3" style="color:#16a34a;">🏷️ Promo Code: <strong>${entry.promoCode}</strong></td>
      <td style="color:#16a34a;font-weight:600;">-₹${entry.promoDiscount.toLocaleString('en-IN')}</td>
    </tr>` : ''}
    <tr class="total-row">
      <td colspan="3">Total Paid</td>
      <td>${entry.amount ? '₹' + entry.amount.toLocaleString('en-IN') : '—'}</td>
    </tr>
  </tbody>
</table>

<div class="footer">
  <p>Thank you for choosing MaroStudio! For support, contact us at support@marostudio.com</p>
  <p style="margin-top:6px;">This is a computer-generated invoice.</p>
</div>

<div style="text-align:center;margin-top:24px;">
  <button onclick="window.print()" style="background:#e6b71e;color:#111;border:none;padding:10px 28px;font-size:14px;font-weight:700;border-radius:8px;cursor:pointer;">
    🖨️ Print / Save as PDF
  </button>
</div>
</body>
</html>`;

  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
  }
};

export const PurchaseHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payment/purchase-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setHistory(data.history || []);
          setUserName(data.userName);
          setUserEmail(data.userEmail);
        }
      } catch (err) {
        console.error('Failed to fetch purchase history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  // Track invoice index per successful purchase for correct numbering
  let successCount = 0;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg border border-neutral-800 hover:border-gold-500/50 text-neutral-400 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Purchase History</h1>
            {userEmail && <p className="text-neutral-400 text-sm mt-0.5">{userEmail}</p>}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-neutral-400 text-sm">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-white font-semibold text-lg">No purchase history yet</h2>
            <p className="text-neutral-500 text-sm max-w-xs">Your plan purchases and payment attempts will appear here.</p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-4 px-6 py-2 bg-gold-600 hover:bg-gold-500 text-white rounded-lg font-semibold text-sm transition-all"
            >
              View Plans
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry, i) => {
              const isSuccess = entry.action === 'purchase';
              const invoiceIdx = isSuccess ? successCount++ : -1;

              return (
                <div
                  key={i}
                  className={`relative rounded-xl border p-5 transition-all ${
                    isSuccess
                      ? 'bg-neutral-900 border-neutral-800 hover:border-gold-500/30'
                      : 'bg-red-950/20 border-red-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Left info */}
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`mt-0.5 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSuccess ? 'bg-green-500/15' : 'bg-red-500/15'
                      }`}>
                        {isSuccess ? (
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white">{entry.planName} Plan</span>
                          {entry.billingPeriod && (
                            <span className="text-xs text-neutral-400 capitalize bg-neutral-800 px-2 py-0.5 rounded-full">
                              {entry.billingPeriod}
                            </span>
                          )}
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isSuccess
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {isSuccess ? '✓ Successful' : '✗ Failed'}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-500 mt-1">{formatDate(entry.date)}</p>

                        {isSuccess && entry.totalCredits && (
                          <p className="text-sm text-gold-400 mt-1 font-medium">
                            {entry.totalCredits.toLocaleString()} credits added
                          </p>
                        )}

                        {isSuccess && entry.promoCode && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/15 px-2 py-0.5 rounded-full">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {entry.promoCode}
                            </span>
                            {entry.promoDiscount && (
                              <span className="text-xs text-green-400">-₹{entry.promoDiscount.toLocaleString('en-IN')} off</span>
                            )}
                          </div>
                        )}

                        {isSuccess && entry.razorpayPaymentId && (
                          <p className="text-xs text-neutral-500 mt-1 font-mono">
                            Payment ID: {entry.razorpayPaymentId}
                          </p>
                        )}

                        {!isSuccess && entry.reason && (
                          <p className="text-sm text-red-400 mt-1">
                            {entry.reason}
                            {entry.errorCode && (
                              <span className="text-red-600 ml-1 text-xs">({entry.errorCode})</span>
                            )}
                          </p>
                        )}

                        {entry.amount && (
                          <div className="mt-1">
                            {entry.originalAmount && entry.promoDiscount ? (
                              <p className="text-sm text-neutral-300 font-semibold">
                                <span className="text-neutral-500 line-through text-xs mr-1">₹{Number(entry.originalAmount).toLocaleString('en-IN')}</span>
                                ₹{Number(entry.amount).toLocaleString('en-IN')}
                              </p>
                            ) : (
                              <p className="text-sm text-neutral-300 font-semibold">
                                ₹{Number(entry.amount).toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Download Invoice */}
                    {isSuccess && (
                      <button
                        onClick={() => openInvoice(entry, userName, userEmail, invoiceIdx)}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gold-400 border border-gold-500/30 rounded-lg hover:bg-gold-500/10 hover:border-gold-500/60 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Invoice
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
