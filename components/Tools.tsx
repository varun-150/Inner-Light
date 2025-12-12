
import React, { useState, useEffect, useRef } from 'react';
import { X, Wind, Music, Play, Pause, RefreshCw, Eye, CircleDot, RotateCcw, Video, Upload, Sparkles } from 'lucide-react';
import { analyzeVideoContent } from '../services/geminiService';

interface ToolProps {
  onClose: () => void;
}

export const ChantingCounter: React.FC<ToolProps> = ({ onClose }) => {
    const [count, setCount] = useState(0);
    const [cycle, setCycle] = useState(0);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const target = 108; // Traditional Mala bead count

    const handleTap = () => {
        if (showResetConfirm) return; // Prevent counting when modal is open

        // Haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(15);
        
        setCount(prev => {
            const newCount = prev + 1;
            if (newCount > target) {
                setCycle(c => c + 1);
                return 1;
            }
            return newCount;
        });
    };

    const handleResetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowResetConfirm(true);
    };

    const confirmReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCount(0);
        setCycle(0);
        setShowResetConfirm(false);
    };

    const cancelReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowResetConfirm(false);
    };

    // Calculate progress for the SVG circle
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (count / target) * circumference;

    return (
        <div 
            onClick={handleTap}
            className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center text-white cursor-pointer select-none"
        >
            <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }} 
                className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
            >
                <X size={24} />
            </button>

            <div className="absolute top-6 left-6 text-slate-400 text-sm font-medium">
                Cycle: {cycle}
            </div>

            <div className="relative flex items-center justify-center">
                {/* Progress Ring Background */}
                <svg className="transform -rotate-90 w-80 h-80">
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-slate-800"
                    />
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="text-orange-500 transition-all duration-300 ease-out"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Counter Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-light tracking-tighter tabular-nums animate-pulse-short">{count}</span>
                    <span className="text-slate-500 text-sm uppercase tracking-widest mt-2">/ {target}</span>
                </div>
            </div>

            <p className="mt-12 text-slate-400 text-sm animate-pulse">Tap anywhere to count</p>

            <button 
                onClick={handleResetClick}
                className="absolute bottom-10 flex items-center gap-2 text-slate-500 hover:text-white transition-colors p-4"
            >
                <RotateCcw size={16} /> Reset
            </button>

            {/* Custom Confirmation Modal */}
            {showResetConfirm && (
                <div 
                    onClick={(e) => e.stopPropagation()} // Stop tap propagation to background
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up cursor-default"
                >
                    <div className="bg-slate-800 rounded-2xl p-6 w-72 text-center shadow-2xl border border-slate-700">
                        <h3 className="text-white font-bold text-lg mb-2">Reset Counter?</h3>
                        <p className="text-slate-400 text-sm mb-6">This will clear your current cycle progress.</p>
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={cancelReset}
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-700 text-slate-300 font-medium hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmReset}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-lg shadow-red-900/20 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AnxietyEasePack: React.FC<ToolProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [instruction, setInstruction] = useState("Breathe In (4s)");

  useEffect(() => {
    const cycle = [
      { text: "Breathe In...", duration: 4000 },
      { text: "Hold...", duration: 7000 },
      { text: "Exhale...", duration: 8000 },
    ];
    
    let timeoutId: any;
    let currentStep = 0;

    const runStep = () => {
        setInstruction(cycle[currentStep].text);
        setStep(currentStep);
        
        timeoutId = setTimeout(() => {
            currentStep = (currentStep + 1) % 3;
            runStep();
        }, cycle[currentStep].duration);
    };

    runStep();

    return () => {
        if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#A3C4F3] z-50 flex flex-col items-center justify-center p-6 text-white transition-opacity duration-500 animate-fade-in-up">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm transition-colors">
        <X size={24} />
      </button>

      <h2 className="text-3xl font-light mb-12 tracking-wide text-center drop-shadow-md">Anxiety Ease</h2>

      <div className={`relative flex items-center justify-center w-72 h-72 rounded-full bg-white/20 transition-all duration-[4000ms] ${step === 0 ? 'scale-110' : step === 2 ? 'scale-90' : 'scale-100'}`}>
        <div className={`absolute inset-0 bg-white/10 rounded-full animate-pulse-short`}></div>
        <div className={`w-56 h-56 rounded-full bg-white/30 flex items-center justify-center transition-all duration-[4000ms] backdrop-blur-sm shadow-xl`}>
             <span className="text-2xl font-bold tracking-widest uppercase">{instruction}</span>
        </div>
      </div>

      <p className="mt-16 text-center text-lg max-w-md opacity-90 font-medium">
        "You are safe. This moment will pass. You are grounded."
      </p>
    </div>
  );
};

export const QuickToolsMenu: React.FC<{onSelect: (tool: string) => void}> = ({ onSelect }) => {
    return (
        <div className="bg-white rounded-[2rem] shadow-sm p-6 border border-slate-100 w-full animate-fade-in-up">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 pl-1">Quick Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button onClick={() => onSelect('breathing')} className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all hover:scale-105 group border border-orange-100 shadow-sm hover:shadow-md">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors text-orange-500 group-hover:text-orange-600">
                        <Wind size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">1-Min Breathe</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">Instant calm</span>
                </button>
                
                <button onClick={() => onSelect('chanting')} className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all hover:scale-105 group border border-orange-100 shadow-sm hover:shadow-md">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors text-orange-500 group-hover:text-orange-600">
                        <CircleDot size={24} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Mala Beads</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">Focus mantra</span>
                </button>
                
                <button onClick={() => onSelect('video')} className="flex flex-col items-center justify-center p-6 bg-amber-50 hover:bg-amber-100 rounded-2xl transition-all hover:scale-105 group border border-amber-100 shadow-sm hover:shadow-md">
                     <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors text-amber-500 group-hover:text-amber-600">
                        <Video size={24} />
                     </div>
                    <span className="text-sm font-bold text-slate-700">Video Insight</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">Analyze clip</span>
                </button>
            </div>
        </div>
    );
}

export const GroundingAudio: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
             <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                </button>
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                        <Music size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Nature Grounding</h3>
                </div>
                <p className="text-slate-500 text-sm mb-8 pl-1">Listen to the sounds of nature and center yourself.</p>
                
                <div className="bg-gradient-to-br from-orange-500 to-amber-600 h-40 rounded-2xl flex items-center justify-center mb-8 overflow-hidden relative shadow-inner">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-20 mix-blend-overlay"></div>
                     {/* Visualizer bars */}
                    <div className="flex items-end gap-1.5 h-20 z-10">
                        {[...Array(12)].map((_, i) => (
                             <div key={i} className={`w-3 bg-white/80 rounded-full transition-all duration-300 shadow-lg ${isPlaying ? 'animate-breathe' : 'h-2 opacity-50'}`} style={{
                                 height: isPlaying ? `${20 + Math.random() * 80}%` : '15%',
                                 animationDelay: `${i * 0.1}s`
                             }}></div>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    {isPlaying ? <><Pause size={24} fill="currentColor"/> Pause</> : <><Play size={24} fill="currentColor" className="ml-1"/> Play Audio</>}
                </button>
             </div>
        </div>
    )
}

export const VideoInsight: React.FC<ToolProps> = ({ onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalysis('');
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const result = await analyzeVideoContent(file, "Analyze this video for emotional context and provide a brief spiritual reflection based on what you see.");
            setAnalysis(result);
        } catch (error) {
            setAnalysis("Unable to process the video at this time. Please try a smaller file or different format.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in-up">
            <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 relative shadow-2xl flex flex-col max-h-[85vh]">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-amber-100 rounded-2xl text-amber-600">
                        <Video size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Video Insight</h2>
                        <p className="text-slate-500 text-sm font-medium">Discover emotional essence.</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {!analysis ? (
                        <div className="space-y-6">
                            <div className="border-3 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:bg-slate-50 transition-colors relative group">
                                <input 
                                    type="file" 
                                    accept="video/*" 
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {file ? (
                                    <div className="transform transition-transform group-hover:scale-105">
                                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Video size={32} />
                                        </div>
                                        <p className="font-bold text-slate-800 text-lg mb-1">{file.name}</p>
                                        <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Click to change</p>
                                    </div>
                                ) : (
                                    <div className="transform transition-transform group-hover:scale-105">
                                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-100 group-hover:text-amber-500 transition-colors">
                                            <Upload size={32} />
                                        </div>
                                        <p className="font-bold text-slate-600 text-lg mb-2">Tap to upload video</p>
                                        <p className="text-xs text-slate-400 font-medium">Supports MP4, WebM (Max 1 min)</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleAnalyze}
                                disabled={!file || loading}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
                            >
                                {loading ? <><RefreshCw className="animate-spin" /> Analyzing...</> : <><Sparkles size={20} /> Analyze Video</>}
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in-up space-y-6">
                            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                                <h3 className="text-xs font-bold text-amber-500 uppercase mb-3 flex items-center gap-2">
                                    <Sparkles size={14}/> Gemini Analysis
                                </h3>
                                <div className="prose prose-sm prose-purple text-slate-700 leading-relaxed font-medium">
                                    {analysis}
                                </div>
                            </div>
                            <button 
                                onClick={() => { setFile(null); setAnalysis(''); }}
                                className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:border-amber-200 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                                Analyze Another Video
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

