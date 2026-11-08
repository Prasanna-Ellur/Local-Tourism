import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, ShieldCheck, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface MockPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingReference: string;
  amount: number;
  onConfirmPayment: (paymentMethod: 'CARD' | 'UPI' | 'NETBANKING' | 'MOCK', mockStatus: 'SUCCESS' | 'FAILED') => Promise<void>;
}

export const MockPaymentModal: React.FC<MockPaymentModalProps> = ({
  isOpen,
  onClose,
  bookingReference,
  amount,
  onConfirmPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'CARD' | 'UPI' | 'NETBANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [upiId, setUpiId] = useState('traveler@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [bank, setBank] = useState('HDFC Bank');

  if (!isOpen) return null;

  const handlePay = async (status: 'SUCCESS' | 'FAILED') => {
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      await onConfirmPayment(activeTab, status);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Alert explicitly identifying development test mode */}
        <div className="bg-amber-500 text-stone-900 px-4 py-2.5 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-900 animate-pulse" />
            DEVELOPMENT PAYMENT SANDBOX (MOCK GATEWAY)
          </span>
          <span className="text-[10px] uppercase tracking-wider bg-stone-900 text-amber-400 px-2 py-0.5 rounded font-bold">
            Simulated
          </span>
        </div>

        {/* Modal Header */}
        <div className="p-6 border-b border-stone-100 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900">Complete Payment</h3>
            <p className="text-xs text-stone-500 mt-1">
              Booking Ref: <span className="font-mono font-semibold text-forest">{bookingReference}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Amount Display */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <span className="text-sm font-medium text-stone-600">Total Payable Amount</span>
          <span className="text-2xl font-extrabold text-forest">{formatCurrency(amount)}</span>
        </div>

        {/* Payment Tabs */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('UPI')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'UPI'
                  ? 'bg-white text-forest shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smartphone size={15} />
              UPI / QR
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('CARD')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'CARD'
                  ? 'bg-white text-forest shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CreditCard size={15} />
              Card
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('NETBANKING')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'NETBANKING'
                  ? 'bg-white text-forest shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building size={15} />
              Netbanking
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'UPI' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">Enter Virtual Payment Address (UPI ID)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@bank"
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
              />
              <p className="text-[11px] text-stone-500 flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-600" />
                Supports GPay, PhonePe, Paytm, BHIM and all Indian UPI handles.
              </p>
            </div>
          )}

          {activeTab === 'CARD' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Card Number (Mocked)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">CVV</label>
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'NETBANKING' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">Select Bank</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest focus:outline-none bg-white"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handlePay('SUCCESS')}
              className="w-full py-3.5 px-4 rounded-xl bg-forest text-white font-semibold hover:bg-forest-700 transition flex items-center justify-center gap-2 shadow-sm text-sm disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Simulating Gateway Approval...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Simulate Successful Payment ({formatCurrency(amount)})
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handlePay('FAILED')}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 transition flex items-center justify-center gap-1.5"
            >
              Test Payment Failure Flow (Simulate Bank Decline)
            </button>
          </div>
        </div>

        {/* Security disclaimer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500 text-center">
          🔒 Test mode only. No real bank accounts or credit cards are debited.
        </div>
      </div>
    </div>
  );
};
