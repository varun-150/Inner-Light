
import React, { useState, useEffect } from 'react';
import { User, BeliefSystem, GeminiJSONResponse, JournalLog, DailyWisdom } from '../types';
import { analyzeEmotion, reframeWorry, getDailyWisdom } from '../services/geminiService';
import { ChatBot } from './ChatBot';
import { ChantingCounter, AnxietyEasePack, QuickToolsMenu, GroundingAudio, VideoInsight } from './Tools';
import { Learn } from './Learn';
import { Reminders } from './Reminders';
import { Profile } from './Profile';
import { Payment } from './Payment';
import { useTheme } from '../contexts/ThemeContext';
import {
    LogOut,
    MessageCircle,
    Home,
    BookOpen,
    History,
    Sparkles,
    ArrowRight,
    Feather,
    X,
    Wind,
    Bell,
    User as UserIcon,
    Crown,
    Settings,
    ChevronDown,
    ChevronUp,
    Sun,
    Moon,
    LayoutGrid,
    Menu,
    Check
} from 'lucide-react';

interface DashboardProps {
    user: User;
    onLogout: () => void;
    onUpdateUser: (user: User) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdateUser }) => {
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'history'>('home');
    const [dailyWisdom, setDailyWisdom] = useState<DailyWisdom | null>(null);

    // Modals
    const [showChat, setShowChat] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showReminders, setShowReminders] = useState(false);
    const [activeTool, setActiveTool] = useState<string | null>(null);

    // Check-In State
    const [journalText, setJournalText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<GeminiJSONResponse | null>(null);

    // Overthinking State
    const [worryText, setWorryText] = useState('');
    const [reframing, setReframing] = useState(false);
    const [reframeResult, setReframeResult] = useState<GeminiJSONResponse | null>(null);

    // History State
    const [historyLogs, setHistoryLogs] = useState<JournalLog[]>([]);
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

    useEffect(() => {
        loadDailyWisdom();
        loadHistory();
    }, [user.userId]);

    const loadDailyWisdom = async () => {
        try {
            const key = `daily_wisdom_${new Date().toDateString()}`;
            const cached = localStorage.getItem(key);
            if (cached) {
                setDailyWisdom(JSON.parse(cached));
            } else {
                const wisdom = await getDailyWisdom(user.belief);
                const data = { ...wisdom, date: new Date().toDateString() };
                setDailyWisdom(data);
                localStorage.setItem(key, JSON.stringify(data));
            }
        } catch (e) {
            console.error("Failed to load wisdom", e);
        }
    };

    const loadHistory = () => {
        try {
            const saved = localStorage.getItem(`innerlight_history_${user.userId}`);
            if (saved) {
                const parsed: JournalLog[] = JSON.parse(saved);
                // Safe sort handling invalid dates
                const sorted = parsed.sort((a, b) => {
                    const tA = new Date(a.timestamp).getTime();
                    const tB = new Date(b.timestamp).getTime();
                    return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
                });
                setHistoryLogs(sorted);
            }
        } catch (e) {
            console.error("Failed to load history", e);
            setHistoryLogs([]);
        }
    };

    const handleAnalyze = async () => {
        if (!journalText.trim()) return;
        setAnalyzing(true);
        try {
            const result = await analyzeEmotion(journalText, user.belief);
            setAnalysisResult(result);

            const newLog: JournalLog = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                text: journalText,
                analysis: result
            };
            const updatedHistory = [newLog, ...historyLogs];
            setHistoryLogs(updatedHistory);
            localStorage.setItem(`innerlight_history_${user.userId}`, JSON.stringify(updatedHistory));

        } catch (error) {
            console.error(error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleReframe = async () => {
        if (!worryText.trim()) return;
        setReframing(true);
        try {
            const result = await reframeWorry(worryText, user.belief);
            setReframeResult(result);
        } catch (error) {
            console.error(error);
        } finally {
            setReframing(false);
        }
    };

    const resetAnalysis = () => {
        setAnalysisResult(null);
        setJournalText('');
    };

    const resetReframe = () => {
        setReframeResult(null);
        setWorryText('');
    };

    const navItems = [
        { id: 'home', label: 'Sanctuary', icon: Home },
        { id: 'learn', label: 'Wisdom Library', icon: BookOpen },
        { id: 'history', label: 'Journey', icon: History },
    ];

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans relative overflow-hidden">
            {/* Mandala Background for Entire Website */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(/assets/mandala-bg.jpg)',
                }}
            />
            {/* Enhanced theme-aware overlay for readability */}
            <div className={`fixed inset-0 ${theme === 'dark'
                ? 'bg-gradient-to-br from-orange-950/95 via-amber-950/90 to-yellow-950/95'
                : 'bg-gradient-to-br from-orange-100/95 via-yellow-50/90 to-amber-50/95'
                }`} />

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className={`hidden md:flex w-72 flex-col fixed inset-y-0 left-0 z-30 border-r relative ${theme === 'dark'
                ? 'bg-orange-900/50 backdrop-blur-2xl border-orange-800/40 shadow-[4px_0_24px_rgba(234,88,12,0.25)]'
                : 'bg-white/60 backdrop-blur-2xl border-orange-300/50 shadow-[4px_0_24px_rgba(251,146,60,0.15)]'
                }`}>
                <div className="p-8 pb-6">
                    <div className="flex items-center gap-3 text-slate-900">
                        <div className="bg-orange-100/50 p-2.5 rounded-xl text-orange-500 shadow-sm border border-orange-100">
                            <Sun size={26} strokeWidth={2} className="animate-pulse-short" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight leading-none">INNER<span className="text-orange-600">LIGHT</span></span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Wellness</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 relative overflow-hidden">
                    {/* Mandala Background for Menu Section */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                        style={{
                            backgroundImage: 'url(/assets/mandala-bg.jpg)',
                        }}
                    />
                    {/* Warm overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-orange-100/50 to-yellow-50/60" />

                    <div className="px-4 mb-2 relative z-10">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Menu</p>
                    </div>
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden z-10 ${isActive
                                    ? 'bg-gradient-to-r from-orange-100 to-yellow-50 text-orange-700 shadow-md border border-orange-200'
                                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 backdrop-blur-sm'
                                    }`}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-xl"></div>}
                                <Icon size={22} className={`transition-colors ${isActive ? 'fill-orange-100 text-orange-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className={`p-4 border-t relative z-10 ${theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-slate-50/50 border-slate-100'
                    }`}>
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className={`w-full mb-4 flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${theme === 'dark'
                            ? 'bg-orange-800/60 hover:bg-orange-800/80 text-orange-100 border border-orange-700/50'
                            : 'bg-white/70 hover:bg-white text-slate-700 border border-orange-300'
                            }`}
                    >
                        <span className="flex items-center gap-2 text-sm font-bold">
                            {theme === 'dark' ? (
                                <>
                                    <Moon size={16} className="text-yellow-300" />
                                    Dark Mode
                                </>
                            ) : (
                                <>
                                    <Sun size={16} className="text-orange-500" />
                                    Light Mode
                                </>
                            )}
                        </span>
                        <div className={`w-10 h-6 rounded-full transition-all ${theme === 'dark' ? 'bg-yellow-600' : 'bg-orange-500'
                            } relative`}>
                            <div className={`absolute top-1 transition-all duration-200 w-4 h-4 rounded-full bg-white shadow-md ${theme === 'dark' ? 'right-1' : 'left-1'
                                }`} />
                        </div>
                    </button>

                    {!user.isPremium && (
                        <div className="mb-4 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl p-4 text-white shadow-lg shadow-orange-200 relative overflow-hidden group cursor-pointer" onClick={() => setShowPayment(true)}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Crown size={48} /></div>
                            <h4 className="font-bold text-sm mb-1 relative z-10">Go Premium</h4>
                            <p className="text-xs opacity-80 mb-3 relative z-10">Unlock unlimited insights.</p>
                            <button className="text-[10px] font-bold bg-white text-orange-600 px-3 py-1.5 rounded-full relative z-10 hover:bg-orange-50 transition-colors">Upgrade Now</button>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-slate-100 hover:shadow-sm cursor-pointer" onClick={() => setShowProfile(true)}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 overflow-hidden">
                                {user.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" /> : <UserIcon size={20} />}
                            </div>
                            <div className="flex flex-col items-start overflow-hidden">
                                <span className="text-sm font-bold text-slate-800 truncate max-w-[100px]">{user.name}</span>
                                <span className="text-[10px] text-slate-500 truncate">{user.belief}</span>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setShowReminders(true); }} className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                            <Bell size={16} />
                        </button>
                    </div>

                    <button onClick={onLogout} className="mt-2 w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 py-2 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* --- MOBILE HEADER --- */}
            <header className="md:hidden bg-white/60 backdrop-blur-xl border-b border-orange-100 sticky top-0 z-20 px-4 py-3 flex justify-between items-center shadow-sm relative">
                <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-1.5 rounded-lg text-orange-500">
                        <Sun size={20} />
                    </div>
                    <h1 className="font-bold text-slate-800 tracking-tight text-lg">
                        INNER<span className="text-indigo-600">LIGHT</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowReminders(true)}
                        className="p-2 text-slate-400 hover:text-indigo-600 rounded-full"
                    >
                        <Bell size={20} />
                    </button>

                    <button
                        onClick={() => setShowProfile(true)}
                        className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden"
                    >
                        {user.profileImage ? <img src={user.profileImage} alt="User" className="w-full h-full object-cover" /> : <UserIcon size={16} />}
                    </button>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 md:ml-72 transition-all duration-300 relative z-10">
                <div className="max-w-5xl mx-auto p-4 md:p-10 pb-28 md:pb-10">

                    {activeTab === 'home' && (
                        <div className="hidden md:flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-slate-800">Namaste, {user.name}</h2>
                                <p className="text-slate-500 mt-1">Ready to find your inner balance today?</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setActiveTool('breathing')} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm">
                                    Quick Breathe
                                </button>
                                <button onClick={() => setShowChat(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 flex items-center gap-2">
                                    <MessageCircle size={16} /> Chat Guide
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="animate-fade-in-up">
                        {activeTab === 'home' && (
                            <div className="space-y-8">
                                <div className="md:hidden">
                                    <h2 className="text-2xl font-serif text-slate-800 mb-1">Namaste, {user.name}</h2>
                                    <p className="text-slate-500 text-sm">Let's find some clarity today.</p>
                                </div>

                                {dailyWisdom && (
                                    <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-125 transition-transform duration-700">
                                            <Sparkles size={120} />
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>

                                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                                            <div className="max-w-xl">
                                                <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                                                    <Sparkles size={10} /> Daily Wisdom
                                                </div>
                                                <p className="font-serif text-xl md:text-2xl italic leading-relaxed opacity-95">"{dailyWisdom.quote}"</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">— {dailyWisdom.source}</span>
                                                <div className="text-[10px] opacity-60 bg-black/20 px-2 py-1 rounded-lg">
                                                    {new Date().toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <section>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <LayoutGrid size={18} className="text-indigo-500" /> Mindfulness Tools
                                    </h3>
                                    <QuickToolsMenu onSelect={setActiveTool} />
                                </section>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <section>
                                        {!analysisResult ? (
                                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
                                                            <Feather size={18} />
                                                        </div>
                                                        <h3 className="font-bold text-slate-800">Clarity Check-in</h3>
                                                    </div>
                                                    <textarea
                                                        className="w-full flex-1 min-h-[120px] p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none text-slate-600 placeholder:text-slate-400 transition-all mb-4"
                                                        placeholder="Pour your thoughts here... How is your spirit feeling right now?"
                                                        value={journalText}
                                                        onChange={(e) => setJournalText(e.target.value)}
                                                    ></textarea>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-xs text-slate-400 font-medium">AI-powered emotional analysis</p>
                                                        <button
                                                            onClick={handleAnalyze}
                                                            disabled={analyzing || !journalText.trim()}
                                                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-slate-200"
                                                        >
                                                            {analyzing ? 'Reflecting...' : 'Analyze'}
                                                            {!analyzing && <Sparkles size={16} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-[2rem] shadow-xl border border-indigo-50 overflow-hidden animate-fade-in-up h-full">
                                                <div className="bg-indigo-50 p-4 flex justify-between items-center border-b border-indigo-100">
                                                    <span className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-1">
                                                        <Sparkles size={12} /> AI Insight
                                                    </span>
                                                    <button onClick={resetAnalysis} className="p-1 text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100 rounded-full transition-colors"><X size={16} /></button>
                                                </div>
                                                <div className="p-6 space-y-5">
                                                    <div>
                                                        <h4 className="text-xs text-slate-400 font-bold uppercase mb-1">Emotion Detected</h4>
                                                        <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
                                                            {analysisResult.emotion}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-xs text-slate-400 font-bold uppercase mb-2">Wisdom for you</h4>
                                                        <p className="text-slate-700 italic font-serif border-l-4 border-indigo-200 pl-4 py-1 leading-relaxed">
                                                            "{analysisResult.spiritualWisdom}"
                                                        </p>
                                                    </div>

                                                    <div className="bg-green-50/50 p-4 rounded-xl flex items-start gap-3 border border-green-100">
                                                        <div className="p-1.5 bg-green-100 text-green-600 rounded-full shrink-0"><Wind size={14} /></div>
                                                        <div>
                                                            <h5 className="font-bold text-green-800 text-xs uppercase mb-1">Suggested Action</h5>
                                                            <p className="text-slate-700 text-sm leading-relaxed">{analysisResult.suggestedAction}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </section>

                                    <section>
                                        <div className="bg-gradient-to-br from-slate-100 to-white rounded-[2rem] p-1 border border-slate-200 h-full">
                                            <div className="bg-white rounded-[1.8rem] p-6 h-full flex flex-col justify-center">
                                                <div className="mb-4">
                                                    <h3 className="font-bold text-slate-800 text-lg">Burden to Blessing</h3>
                                                    <p className="text-sm text-slate-400">Reframe your worries into strength.</p>
                                                </div>

                                                {!reframeResult ? (
                                                    <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-200 transition-all">
                                                        <input
                                                            type="text"
                                                            value={worryText}
                                                            onChange={(e) => setWorryText(e.target.value)}
                                                            placeholder="I am worried about..."
                                                            className="flex-1 bg-transparent px-3 py-2 focus:outline-none text-slate-700 placeholder:text-slate-400"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleReframe()}
                                                        />
                                                        <button
                                                            onClick={handleReframe}
                                                            disabled={reframing || !worryText.trim()}
                                                            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-md shadow-indigo-200"
                                                        >
                                                            <ArrowRight size={20} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="animate-fade-in-up">
                                                        <div className="bg-green-50 p-5 rounded-2xl border border-green-100 mb-4 relative">
                                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                                <Sparkles size={40} className="text-green-600" />
                                                            </div>
                                                            <p className="text-green-800 font-medium text-sm leading-relaxed relative z-10">{reframeResult.reframedThought}</p>
                                                        </div>
                                                        <button onClick={resetReframe} className="w-full py-2 text-xs text-slate-400 hover:text-indigo-600 font-bold uppercase tracking-wide hover:bg-slate-50 rounded-lg transition-colors">
                                                            Try Another Thought
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        )}

                        {activeTab === 'learn' && (
                            <Learn belief={user.belief} />
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-6 animate-fade-in-up">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-800">Your Journey</h2>
                                        <p className="text-slate-500 mt-1">Reflect on your path of growth.</p>
                                    </div>
                                    <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {historyLogs.length} Entries
                                    </div>
                                </div>

                                {historyLogs.length === 0 ? (
                                    <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-slate-100 border-dashed">
                                        <Feather className="mx-auto text-slate-300 mb-4" size={56} />
                                        <p className="text-slate-500 text-lg font-medium">No entries yet.</p>
                                        <p className="text-slate-400 text-sm mb-6">Your spiritual journal starts with a single thought.</p>
                                        <button
                                            onClick={() => setActiveTab('home')}
                                            className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-full font-bold text-sm hover:bg-indigo-100 transition-colors"
                                        >
                                            Start Check-in
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-1 gap-4">
                                        {historyLogs.map(log => (
                                            <div key={log.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-lg hover:border-indigo-100 group">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                                {new Date(log.timestamp).toLocaleDateString()}
                                                            </span>
                                                            <span className="text-xs text-slate-300 font-bold">•</span>
                                                            <span className="text-xs font-bold text-slate-400">
                                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        {log.analysis.emotion && (
                                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                                                {log.analysis.emotion}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-between items-center gap-4">
                                                        <p className="text-slate-800 font-serif font-medium line-clamp-2 text-lg leading-relaxed group-hover:text-indigo-900 transition-colors">{log.text}</p>
                                                        <button className={`p-2 rounded-full transition-all ${expandedLogId === log.id ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                                            <ChevronDown size={20} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {expandedLogId === log.id && (
                                                    <div className="mt-6 pt-6 border-t border-slate-100 animate-fade-in-up">
                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            {log.analysis.spiritualWisdom && (
                                                                <div className="bg-indigo-50/50 p-4 rounded-2xl">
                                                                    <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2 tracking-wider">Wisdom</p>
                                                                    <p className="text-sm text-indigo-900 font-serif italic leading-relaxed">"{log.analysis.spiritualWisdom}"</p>
                                                                </div>
                                                            )}
                                                            {log.analysis.suggestedAction && (
                                                                <div className="bg-slate-50 p-4 rounded-2xl">
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Action</p>
                                                                    <div className="flex items-center gap-2">
                                                                        <Check size={14} className="text-green-500" />
                                                                        <p className="text-sm text-slate-700">{log.analysis.suggestedAction}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* --- MOBILE BOTTOM NAV (Floating Glass) --- */}
            <div className="fixed bottom-6 left-0 right-0 flex justify-center z-30 pointer-events-none md:hidden animate-fade-in-up">
                <nav className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-900/10 rounded-[2rem] p-2 flex gap-1 pointer-events-auto max-w-xs w-full justify-between px-6">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300 scale-110 -translate-y-2' : 'text-slate-400 hover:bg-slate-100'}`}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </button>
                        )
                    })}
                </nav>
            </div>

            <button
                onClick={() => setShowChat(true)}
                className="fixed bottom-28 right-6 md:bottom-10 md:right-10 bg-slate-900 text-white p-4 rounded-full shadow-2xl shadow-slate-400 hover:scale-110 transition-transform z-30 hover:bg-indigo-600 group"
            >
                <MessageCircle size={28} className="group-hover:animate-pulse" />
            </button>

            {showChat && <ChatBot user={user} onClose={() => setShowChat(false)} />}
            {showProfile && <Profile user={user} onClose={() => setShowProfile(false)} onUpdateUser={onUpdateUser} />}
            {showPayment && <Payment user={user} onClose={() => setShowPayment(false)} onUpgrade={onUpdateUser} />}
            {showReminders && <Reminders onClose={() => setShowReminders(false)} />}

            {activeTool === 'chanting' && <ChantingCounter onClose={() => setActiveTool(null)} />}
            {activeTool === 'breathing' && <AnxietyEasePack onClose={() => setActiveTool(null)} />}
            {activeTool === 'grounding' && <GroundingAudio onClose={() => setActiveTool(null)} />}
            {activeTool === 'video' && <VideoInsight onClose={() => setActiveTool(null)} />}

        </div>
    );
};
