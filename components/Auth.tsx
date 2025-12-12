

import React, { useState } from 'react';
import { BeliefSystem, User } from '../types';
import { ArrowRight, Lock, Mail, User as UserIcon, Phone, Sun, CheckCircle, Shield } from 'lucide-react';
import { sendOTP, verifyOTP } from '../services/otpService';
import { useTheme } from '../contexts/ThemeContext';

interface AuthProps {
    onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const { theme } = useTheme();
    const [isSignup, setIsSignup] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [belief, setBelief] = useState<BeliefSystem>(BeliefSystem.SPIRITUALITY);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // OTP State
    const [showOTPVerification, setShowOTPVerification] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Enforce OTP Verification for Signup
        if (isSignup && !isPhoneVerified) {
            setFeedback({ type: 'error', text: 'Please verify your phone number with OTP first.' });
            return;
        }

        setLoading(true);
        setFeedback(null);

        // Simulate Network Request
        setTimeout(() => {
            if (isSignup) {
                // REGISTRATION SUCCESS
                setLoading(false);
                setIsSignup(false); // Switch to Login view
                setFeedback({ type: 'success', text: 'Account created successfully! Please log in.' });
                setPassword(''); // Clear password for security/UX
                setIsPhoneVerified(false); // Reset for next time
                setOtpSent(false);
            } else {
                // LOGIN SUCCESS
                const mockUser: User = {
                    userId: 'user-' + Math.random().toString(36).substr(2, 9),
                    name: name || (email.split('@')[0]),
                    age: parseInt(age) || 20,
                    gender: gender || 'Prefer not to say',
                    email,
                    phoneNumber: phone,
                    belief,
                    createdAt: new Date().toISOString(),
                    isPremium: false
                };

                // Persist to local storage to simulate "Remember Me"
                localStorage.setItem('innerlight_user', JSON.stringify(mockUser));
                onLogin(mockUser);
                setLoading(false);
            }
        }, 1500);
    };

    const handleSendOTP = async () => {
        if (!phone || phone.length !== 10) {
            setFeedback({ type: 'error', text: 'Please enter a valid 10-digit phone number' });
            return;
        }

        setOtpLoading(true);
        setFeedback(null);

        const result = await sendOTP(phone);

        if (result.success) {
            setOtpSent(true);
            setShowOTPVerification(true);
            setFeedback({ type: 'success', text: result.message });
            // Show debug OTP in development
            if (result.debug?.otp) {
                console.log('🔐 Development OTP:', result.debug.otp);
                setFeedback({ type: 'success', text: `OTP sent! (Dev: ${result.debug.otp})` });
            }
        } else {
            setFeedback({ type: 'error', text: result.message });
        }

        setOtpLoading(false);
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            setFeedback({ type: 'error', text: 'Please enter a valid 6-digit OTP' });
            return;
        }

        setOtpLoading(true);
        setFeedback(null);

        const result = await verifyOTP(phone, otp);

        if (result.success && result.verified) {
            setFeedback({ type: 'success', text: 'Phone verified successfully!' });
            setShowOTPVerification(false);
            setOtpSent(false);
            setOtp('');
            setIsPhoneVerified(true);
        } else {
            setFeedback({ type: 'error', text: result.message });
        }

        setOtpLoading(false);
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setFeedback(null);
        setShowOTPVerification(false);
        setOtpSent(false);
        setOtp('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Mandala Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(/assets/mandala-bg.jpg)',
                }}
            />
            {/* Enhanced theme-aware overlay for better text contrast */}
            <div className={`absolute inset-0 ${theme === 'dark'
                ? 'bg-gradient-to-br from-orange-950/90 via-amber-950/85 to-yellow-950/90'
                : 'bg-gradient-to-br from-orange-500/30 via-yellow-400/25 to-amber-400/20'
                }`} />

            <div className={`w-full max-w-md rounded-3xl shadow-2xl p-8 transition-all animate-fade-in-up relative z-10 ${theme === 'dark'
                ? 'bg-orange-950/95 backdrop-blur-xl border border-orange-800/40'
                : 'bg-white/95 backdrop-blur-sm'
                }`}>
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-40"></div>
                            <Sun className="text-orange-500 relative z-10" size={48} strokeWidth={2} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                        INNER<span className="text-indigo-600">LIGHT</span>
                    </h1>
                    <p className="text-slate-500">Your journey to spiritual balance begins here.</p>
                </div>

                {feedback && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {feedback.type === 'success' && <CheckCircle size={18} />}
                        {feedback.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                        <>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        placeholder="Age"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                                        value={age}
                                        onChange={e => setAge(e.target.value)}
                                    />
                                </div>
                                <div className="relative flex-1">
                                    <select
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-slate-700 appearance-none"
                                        value={gender}
                                        onChange={e => setGender(e.target.value)}
                                    >
                                        <option value="" disabled>Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="tel"
                                    placeholder="Phone Number (10 digits)"
                                    required
                                    maxLength={10}
                                    className={`w-full pl-12 pr-32 py-3 bg-slate-50 rounded-xl border ${isPhoneVerified ? 'border-green-200 bg-green-50' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors`}
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                    disabled={isPhoneVerified}
                                />
                                {isPhoneVerified ? (
                                    <div className="absolute right-2 top-2 flex items-center gap-1 bg-green-100 px-3 py-2 rounded-lg border border-green-200">
                                        <CheckCircle size={14} className="text-green-600" />
                                        <span className="text-xs font-bold text-green-700">Verified</span>
                                    </div>
                                ) : !otpSent ? (
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={otpLoading || phone.length !== 10}
                                        className="absolute right-2 top-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {otpLoading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                ) : (
                                    <div className="absolute right-2 top-2 flex items-center gap-1 bg-green-50 px-3 py-2 rounded-lg">
                                        <CheckCircle size={14} className="text-green-600" />
                                        <span className="text-xs font-bold text-green-700">OTP Sent</span>
                                    </div>
                                )}
                            </div>

                            {/* OTP Verification Input */}
                            {showOTPVerification && (
                                <div className="relative animate-fade-in-up">
                                    <Shield className="absolute left-4 top-3.5 text-orange-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        className="w-full pl-12 pr-32 py-3 bg-orange-50 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-300 focus:outline-none font-medium tracking-widest text-center"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOTP}
                                        disabled={otpLoading || otp.length !== 6}
                                        className="absolute right-2 top-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {otpLoading ? 'Verifying...' : 'Verify'}
                                    </button>
                                </div>
                            )}


                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Belief System</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-slate-700"
                                    value={belief}
                                    onChange={(e) => setBelief(e.target.value as BeliefSystem)}
                                >
                                    {Object.values(BeliefSystem).map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {!isSignup && (
                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                                <input type="checkbox" className="rounded text-indigo-500 focus:ring-indigo-500" />
                                Remember me
                            </label>
                            <button type="button" className="text-indigo-600 hover:text-indigo-800 font-medium">Forgot?</button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500">
                        {isSignup ? "Already have an account?" : "New to InnerLight?"}{" "}
                        <button
                            onClick={toggleMode}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            {isSignup ? "Login" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
