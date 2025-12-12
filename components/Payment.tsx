
import React, { useState } from 'react';
import { X, Check, CreditCard, ShieldCheck, Crown, Loader2, Sparkles } from 'lucide-react';
import { User } from '../types';

interface PaymentProps {
  user: User;
  onClose: () => void;
  onUpgrade: (user: User) => void;
}

export const Payment: React.FC<PaymentProps> = ({ user, onClose, onUpgrade }) => {
  const [step, setStep] = useState<'plans' | 'checkout' | 'success'>('plans');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);

  // Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
        setLoading(false);
        setStep('success');
        onUpgrade({ ...user, isPremium: true });
    }, 2000);
  };

  const features = [
      "Unlimited AI Analysis",
      "Full Learning Library Access",
      "Advanced Anxiety Tools",
      "Personalized Spiritual Roadmap",
      "Priority Chat Support"
  ];

  if (step === 'success') {
      return (
        <div className="fixed inset-0 z-50 bg-orange-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white rounded-3xl p-10 max-w-md text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
                <div className="w-20 h-20 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Crown size={40} className="animate-bounce" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Premium</h2>
                <p className="text-slate-500 mb-8">Your journey to inner peace just got limitless. Thank you for investing in yourself.</p>
                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                    Start Exploring
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl relative animate-fade-in-up flex flex-col md:flex-row overflow-hidden min-h-[600px]">
            <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors md:text-white md:bg-white/20 md:hover:bg-white/30">
                <X size={20} />
            </button>

            {/* Left Side: Visual/Features */}
            <div className="md:w-5/12 bg-gradient-to-br from-orange-600 to-amber-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/30 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles size={12} /> InnerLight Premium
                    </div>
                    <h2 className="text-3xl font-serif mb-4">Unlock your full spiritual potential.</h2>
                    <p className="opacity-80 leading-relaxed mb-8">Go beyond the basics with deeper insights, unlimited tools, and a complete library of wisdom.</p>
                    
                    <ul className="space-y-4">
                        {features.map((feat, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="bg-green-400/20 p-1 rounded-full text-green-300">
                                    <Check size={14} />
                                </div>
                                <span className="font-medium">{feat}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative z-10 mt-8 pt-8 border-t border-white/10 text-xs opacity-60">
                    Secure 256-bit SSL Encrypted payment. Cancel anytime.
                </div>
            </div>

            {/* Right Side: Plans & Checkout */}
            <div className="md:w-7/12 p-8 bg-slate-50 flex flex-col">
                {step === 'plans' ? (
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Choose your plan</h3>
                            <div className="flex justify-center items-center gap-4 mt-6 bg-white p-1 rounded-xl inline-flex shadow-sm border border-slate-200 mx-auto">
                                <button 
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-orange-100 text-orange-700' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Monthly
                                </button>
                                <button 
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Yearly <span className="text-[10px] ml-1 opacity-80 font-normal">SAVE 20%</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <div 
                                onClick={() => setBillingCycle('monthly')}
                                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${billingCycle === 'monthly' ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                            >
                                <p className="text-slate-500 font-bold text-sm mb-1">Monthly</p>
                                <p className="text-3xl font-bold text-slate-900">$9.99<span className="text-sm text-slate-400 font-normal">/mo</span></p>
                            </div>

                            <div 
                                onClick={() => setBillingCycle('yearly')}
                                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all relative overflow-hidden ${billingCycle === 'yearly' ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                            >
                                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg">BEST VALUE</div>
                                <p className="text-slate-500 font-bold text-sm mb-1">Yearly</p>
                                <p className="text-3xl font-bold text-slate-900">$99.99<span className="text-sm text-slate-400 font-normal">/yr</span></p>
                                <p className="text-xs text-green-600 font-bold mt-1">2 months free</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setStep('checkout')}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group"
                        >
                            Continue to Checkout 
                        </button>
                        
                        <button 
                            onClick={onClose}
                            className="w-full py-3 mt-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
                        >
                            Skip for now
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        <button onClick={() => setStep('plans')} className="text-slate-400 hover:text-slate-600 text-sm font-bold mb-6 flex items-center gap-1">
                             ← Back to Plans
                        </button>
                        
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Payment Details</h3>
                        
                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Cardholder Name</label>
                                <input 
                                    type="text"
                                    required
                                    value={cardName}
                                    onChange={e => setCardName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                    <input 
                                        type="text"
                                        required
                                        value={cardNumber}
                                        onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-200 focus:outline-none tracking-widest"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Expiry</label>
                                    <input 
                                        type="text"
                                        required
                                        value={expiry}
                                        onChange={e => setExpiry(e.target.value)}
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">CVC</label>
                                    <input 
                                        type="text"
                                        required
                                        value={cvc}
                                        onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        placeholder="123"
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-orange-50 p-4 rounded-xl flex items-center gap-3 mt-4">
                                <ShieldCheck className="text-orange-600" size={24} />
                                <div className="text-xs text-indigo-800">
                                    <p className="font-bold">Total Due Today: {billingCycle === 'monthly' ? '$9.99' : '$99.99'}</p>
                                    <p>Your subscription will start immediately.</p>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 mt-6"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : `Pay ${billingCycle === 'monthly' ? '$9.99' : '$99.99'}`}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

