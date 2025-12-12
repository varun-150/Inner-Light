
import React, { useState, useEffect, useRef } from 'react';
import { Play, Lock, CheckCircle, Clock, BookOpen, Music, Brain, Plus, ListVideo, MoreVertical, Trash2, Headphones, ArrowRight, ChevronUp, ChevronDown, Globe, Pause, ExternalLink, X, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';
import { Lesson, BeliefSystem, Playlist } from '../types';

interface LearnProps {
    belief: BeliefSystem;
}

export const Learn: React.FC<LearnProps> = ({ belief }) => {
    const [language, setLanguage] = useState<'english' | 'hindi'>('english');

    // --- Data State ---
    const [lessons, setLessons] = useState<Lesson[]>([
        // English Audiobooks
        {
            id: 'eng1',
            title: 'Chapter 1: Observing the Armies',
            description: 'Arjuna sees his kinsmen on the battlefield and is overcome with compassion and despair.',
            duration: '15 min',
            category: 'Wisdom',
            locked: false,
            completed: false,
            color: 'bg-orange-500',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
            externalLink: 'https://vedabase.io/en/library/bg/1/',
            thumbnail: 'https://vedabase.io/static/img/vedabase-logo.png',
            language: 'english'
        },
        {
            id: 'eng2',
            title: 'Chapter 2: Contents of the Gita',
            description: 'Krishna begins his instruction by explaining the difference between the body and the soul.',
            duration: '22 min',
            category: 'Wisdom',
            locked: true,
            completed: false,
            color: 'bg-orange-600',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            externalLink: 'https://vedabase.io/en/library/bg/2/',
            language: 'english'
        },
        // Hindi Audiobooks
        {
            id: 'hin1',
            title: 'अध्याय 1: कुरुक्षेत्र के युद्धस्थल में सैन्यनिरीक्षण',
            description: 'अर्जुन ने युद्धभूमि में अपने सगे-संबंधियों को देखा और विषाद से भर गया।',
            duration: '18 min',
            category: 'Wisdom',
            locked: false,
            completed: false,
            color: 'bg-red-500',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            externalLink: 'https://vedabase.io/hi/library/bg/1/',
            language: 'hindi'
        },
        {
            id: 'hin2',
            title: 'अध्याय 2: गीता का सार',
            description: 'श्री कृष्ण ने आत्मा और शरीर के भेद को समझाते हुए उपदेश प्रारंभ किया।',
            duration: '25 min',
            category: 'Wisdom',
            locked: true,
            completed: false,
            color: 'bg-red-600',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            externalLink: 'https://vedabase.io/hi/library/bg/2/',
            language: 'hindi'
        }
    ]);

    const [playlists, setPlaylists] = useState<Playlist[]>([
        {
            id: 'p1',
            title: 'Essence of Gita (Audiobook)',
            description: 'Listen to the timeless wisdom of the Bhagavad Gita.',
            lessonIds: ['eng1', 'eng2'],
            color: 'bg-gradient-to-br from-orange-500 to-amber-600',
            isCustom: false,
            coverImage: 'https://images.unsplash.com/photo-1621319873429-795b6c039757?q=80&w=1000&auto=format&fit=crop',
            language: 'english'
        },
        {
            id: 'p2',
            title: 'श्रीमद्भगवद्गीता (ऑडियोबुक)',
            description: 'भगवद्गीता के दिव्य ज्ञान का श्रवण करें।',
            lessonIds: ['hin1', 'hin2'],
            color: 'bg-gradient-to-br from-red-600 to-orange-700',
            isCustom: false,
            coverImage: 'https://images.unsplash.com/photo-1605646199468-b78996b0266e?q=80&w=1000&auto=format&fit=crop',
            language: 'hindi'
        },
        {
            id: 'ext1',
            title: 'Bhagavat Gita Classes',
            description: 'Comprehensive audio classes on Bhagavad Gita.',
            lessonIds: [],
            color: 'bg-gradient-to-br from-orange-600 to-amber-700',
            isCustom: false,
            coverImage: '/images/gita_cover.png',
            language: 'english',
            externalLink: 'https://bhagavadgitaclass.com/'
        },
        {
            id: 'ext2',
            title: 'Srimad Bhagavatham',
            description: 'Narrations by Amala Bhakta Dasa.',
            lessonIds: [],
            color: 'bg-gradient-to-br from-amber-600 to-yellow-700',
            isCustom: false,
            coverImage: '/images/bhagavatam_cover.png',
            language: 'english',
            externalLink: 'https://prabhupadavani.org/audio/amala-bhakta-dasa-narrations/srimad-bhagavatam/'
        },
        {
            id: 'ext3',
            title: 'The Ramayanam',
            description: 'The epic tale of Lord Rama.',
            lessonIds: [],
            color: 'bg-gradient-to-br from-orange-500 to-red-600',
            isCustom: false,
            coverImage: '/images/ramayana_cover.png',
            language: 'english',
            externalLink: 'https://www.learnoutloud.com/Free-Audio-Video/Religion-and-Spirituality/Hinduism/The-Ramayan/77806'
        }
    ]);

    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    // Audio Player State
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    // --- Actions ---

    const handleLessonStart = (lesson: Lesson) => {
        if (lesson.locked) return;
        setActiveLesson(lesson);
        // Playback is handled by useEffect when activeLesson changes
    };

    const closePlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setActiveLesson(null);
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const createPlaylist = () => {
        if (!newPlaylistName.trim()) return;
        const newPlaylist: Playlist = {
            id: Date.now().toString(),
            title: newPlaylistName,
            description: language === 'english' ? 'My custom collection' : 'मेरा संग्रह',
            lessonIds: [],
            color: 'bg-slate-800',
            isCustom: true,
            language: language
        };
        setPlaylists([...playlists, newPlaylist]);
        setNewPlaylistName('');
        setShowCreateModal(false);
    };

    const deletePlaylist = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPlaylists(prev => prev.filter(p => p.id !== id));
        if (activePlaylistId === id) setActivePlaylistId(null);
    };

    // --- Audio Handlers ---

    useEffect(() => {
        if (activeLesson) {
            setIsPlaying(true);
            setCurrentTime(0);
            // Duration will be set by onLoadedMetadata
        }
    }, [activeLesson]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const onTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const onEnded = () => {
        setIsPlaying(false);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const skipTime = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration);
        }
    };

    const toggleMute = () => setIsMuted(!isMuted);

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // --- Filtering ---
    const filteredPlaylists = playlists.filter(p => p.language === language || (p.isCustom && p.language === language));

    // --- Render Helpers ---

    const renderActivePlaylistView = () => {
        const playlist = playlists.find(p => p.id === activePlaylistId);
        if (!playlist) return null;

        const playlistLessons = playlist.lessonIds
            .map(id => lessons.find(l => l.id === id))
            .filter((l): l is Lesson => !!l);

        const completedCount = playlistLessons.filter(l => l.completed).length;
        const progress = playlistLessons.length > 0 ? (completedCount / playlistLessons.length) * 100 : 0;

        return (
            <div className="animate-fade-in-up">
                <button
                    onClick={() => setActivePlaylistId(null)}
                    className="mb-6 text-slate-500 hover:text-orange-600 font-bold text-sm flex items-center gap-1 transition-colors"
                >
                    ← {language === 'english' ? 'Back to Library' : 'वापस जाएं'}
                </button>

                <div className={`rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl mb-10 ${playlist.color.includes('gradient') ? playlist.color : 'bg-slate-900'}`}>
                    {/* Background Pattern/Image */}
                    {playlist.coverImage && (
                        <div className="absolute inset-0 z-0">
                            <img src={playlist.coverImage} alt="cover" className="w-full h-full object-cover opacity-50 blur-sm scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                        </div>
                    )}

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                                {playlist.isCustom ? (language === 'english' ? 'My Playlist' : 'मेरी प्लेलिस्ट') : (language === 'english' ? 'Audiobook Series' : 'ऑडियोबुक सीरीज़')}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight shadow-sm">{playlist.title}</h2>
                            <p className="text-white/90 text-lg max-w-xl font-light leading-relaxed mb-6">{playlist.description}</p>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                                    <Headphones size={16} />
                                    {playlistLessons.length} {language === 'english' ? 'Episodes' : 'अध्याय'}
                                </div>
                            </div>
                        </div>

                        {/* Circular Progress */}
                        <div className="relative w-32 h-32 shrink-0 hidden md:flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/20" />
                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 * (1 - progress / 100)} className="text-white transition-all duration-1000 ease-out" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold">{Math.round(progress)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {playlistLessons.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-100 border-dashed">
                            <Music className="mx-auto text-slate-300 mb-4" size={56} />
                            <p className="text-slate-500 font-medium">{language === 'english' ? 'This playlist is empty.' : 'यह प्लेलिस्ट खाली है।'}</p>
                        </div>
                    ) : (
                        playlistLessons.map((lesson, idx) => (
                            <div
                                key={lesson.id}
                                onClick={() => handleLessonStart(lesson)}
                                className={`group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-all hover:shadow-lg hover:border-orange-100 cursor-pointer ${lesson.locked ? 'opacity-60 grayscale' : 'hover:-translate-y-0.5'}`}
                            >
                                <div className="text-slate-300 font-bold text-xl w-8 text-center group-hover:text-orange-500 transition-colors font-serif">{idx + 1}</div>

                                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden relative shadow-md ${lesson.color} group-hover:scale-110 transition-transform`}>
                                    <Play size={24} className="text-white relative z-10 pl-1" />
                                    {lesson.locked && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Lock size={18} className="text-white" /></div>}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-bold text-lg truncate mb-1 ${activeLesson?.id === lesson.id ? 'text-orange-600' : 'text-slate-800'}`}>{lesson.title}</h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium uppercase tracking-wide">
                                        <span className="flex items-center"><Clock size={12} className="mr-1.5" /> {lesson.duration}</span>
                                        {lesson.completed && <span className="flex items-center text-green-600"><CheckCircle size={12} className="mr-1.5" /> Completed</span>}
                                    </div>
                                </div>

                                {playlist.isCustom && (
                                    <button
                                        onClick={(e) => deletePlaylist(playlist.id, e)}
                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    // --- Main Render ---

    return (
        <div className="space-y-10 animate-fade-in-up pb-24">

            {!activePlaylistId ? (
                <>
                    {/* Header Section with Red/Gold Mandala Background */}
                    <div
                        className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-red-900/20 group"
                        style={{ minHeight: '400px' }}
                    >
                        {/* Background Image - Red/Gold Mandala Style */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105"
                            style={{
                                backgroundImage: `url('https://img.freepik.com/free-vector/luxury-mandala-background-with-golden-arabesque-pattern-arabic-islamic-east-style_483537-2263.jpg')`
                            }}
                        />

                        {/* Deep Gradient Overlay for text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-950/95 via-red-900/80 to-transparent"></div>

                        <div className="relative z-10 p-10 h-full flex flex-col justify-between text-white max-w-2xl">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 text-amber-100 shadow-sm">
                                        <Headphones size={12} /> {language === 'english' ? 'Audiobook Library' : 'ऑडियोबुक लाइब्रेरी'}
                                    </div>

                                    {/* Language Toggle */}
                                    <div className="flex bg-black/40 rounded-full p-1 border border-white/10 backdrop-blur-md">
                                        <button
                                            onClick={() => setLanguage('english')}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'english' ? 'bg-white text-red-900 shadow-sm' : 'text-white/70 hover:text-white'}`}
                                        >
                                            Eng
                                        </button>
                                        <button
                                            onClick={() => setLanguage('hindi')}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'hindi' ? 'bg-white text-red-900 shadow-sm' : 'text-white/70 hover:text-white'}`}
                                        >
                                            हिंदी
                                        </button>
                                    </div>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
                                    {language === 'english' ? 'Listen to the wisdom of the ancients.' : 'प्राचीन ज्ञान को सुनें और जीवन में उतारें।'}
                                </h2>
                                <p className="text-red-50 text-lg md:text-xl font-light opacity-90 mb-10 leading-relaxed max-w-lg">
                                    {language === 'english'
                                        ? 'Curated audiobooks for anxiety relief, spiritual connection, and inner peace.'
                                        : 'चिंता मुक्ति, आध्यात्मिक शांति और आंतरिक ज्ञान के लिए विशेष ऑडियोबुक।'}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    const gita = playlists.find(p => p.language === language);
                                    if (gita) setActivePlaylistId(gita.id);
                                }}
                                className="bg-white text-red-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all flex items-center gap-3 w-max"
                            >
                                <Play size={20} fill="currentColor" />
                                {language === 'english' ? 'Start Listening' : 'सुनना शुरू करें'}
                            </button>
                        </div>
                    </div>

                    {/* Playlists Section */}
                    <div className="px-2">
                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{language === 'english' ? 'Your Library' : 'आपकी लाइब्रेरी'}</h3>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="text-orange-600 font-bold hover:bg-orange-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} /> {language === 'english' ? 'New Playlist' : 'नई प्लेलिस्ट'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Create New Card (Mobile Friendly) */}
                            <div
                                onClick={() => setShowCreateModal(true)}
                                className="h-[220px] rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-orange-50/50 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                                    <Plus size={28} />
                                </div>
                                <span className="font-bold text-slate-500 group-hover:text-orange-600 transition-colors">{language === 'english' ? 'Create New Collection' : 'नई प्लेलिस्ट बनाएँ'}</span>
                            </div>

                            {filteredPlaylists.map(playlist => (
                                <div
                                    key={playlist.id}
                                    onClick={() => {
                                        if (playlist.externalLink) {
                                            window.open(playlist.externalLink, '_blank');
                                        } else {
                                            setActivePlaylistId(playlist.id);
                                        }
                                    }}
                                    className={`h-[220px] rounded-3xl p-6 relative overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all group ${playlist.color.includes('bg-') ? playlist.color : 'bg-slate-800'}`}
                                >
                                    {playlist.coverImage && (
                                        <div className="absolute inset-0 z-0">
                                            <img src={playlist.coverImage} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 ease-out" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                        </div>
                                    )}

                                    <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                                        <div className="mb-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <div className="bg-white/20 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center mb-2">
                                                {playlist.externalLink ? <ExternalLink size={20} fill="white" /> : <Play size={20} fill="white" />}
                                            </div>
                                        </div>
                                        <h4 className="font-serif font-bold text-2xl mb-2 leading-tight shadow-sm">{playlist.title}</h4>
                                        <p className="text-sm opacity-80 line-clamp-1 mb-4 font-light">{playlist.description}</p>
                                        <div className="flex items-center justify-between text-xs font-bold opacity-75 border-t border-white/20 pt-3">
                                            {playlist.externalLink ? (
                                                <span className="flex items-center gap-1.5"><ExternalLink size={14} /> {language === 'english' ? 'Open Website' : 'वेबसाइट खोलें'}</span>
                                            ) : (
                                                <span className="flex items-center gap-1.5"><Headphones size={14} /> {playlist.lessonIds.length} {language === 'english' ? 'Chapters' : 'अध्याय'}</span>
                                            )}
                                            {playlist.isCustom && (
                                                <button
                                                    onClick={(e) => deletePlaylist(playlist.id, e)}
                                                    className="hover:text-red-300 hover:bg-red-500/20 p-1.5 rounded-full transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                renderActivePlaylistView()
            )}

            {/* Audio Player Modal */}
            {activeLesson && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-up">
                    <div className="bg-slate-900 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col border border-slate-800 ring-1 ring-white/10">
                        {/* Audio Element */}
                        <audio
                            ref={audioRef}
                            src={activeLesson.audioUrl}
                            onTimeUpdate={onTimeUpdate}
                            onLoadedMetadata={onLoadedMetadata}
                            onEnded={onEnded}
                            autoPlay
                        />

                        <button onClick={closePlayer} className="absolute top-5 right-5 p-2 bg-black/20 hover:bg-white/20 rounded-full text-white transition-colors z-20 backdrop-blur-sm">
                            <X size={20} />
                        </button>

                        {/* Visualizer / Cover */}
                        <div className="h-72 bg-gradient-to-br from-indigo-900 to-slate-950 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:opacity-40 transition-opacity"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                            {/* Audio Wave Animation - Centered and larger */}
                            <div className="flex items-center gap-1.5 h-24 z-10">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={`w-4 bg-gradient-to-t from-orange-500 to-amber-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] ${isPlaying ? 'animate-breathe' : 'h-3 opacity-50'}`} style={{
                                        height: isPlaying ? `${40 + Math.random() * 60}%` : '20%',
                                        animationDelay: `${i * 0.15}s`
                                    }}></div>
                                ))}
                            </div>

                            <div className="absolute bottom-6 left-8 right-8 text-center">
                                <h2 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-md">{activeLesson.title}</h2>
                                <span className="inline-block px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                    {activeLesson.category}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="p-8 bg-slate-900 text-white space-y-8">
                            {/* Progress Bar (Seek Bar) */}
                            <div className="space-y-3">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(99,102,241,0.5)] hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                                />
                                <div className="flex justify-between text-xs text-slate-400 font-mono tracking-wider">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Play Buttons */}
                            <div className="flex items-center justify-center gap-8">
                                <button
                                    onClick={() => skipTime(-10)}
                                    className="text-slate-400 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-full"
                                >
                                    <RotateCcw size={28} />
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-20 h-20 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all active:scale-95"
                                >
                                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                </button>

                                <button
                                    onClick={() => skipTime(10)}
                                    className="text-slate-400 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-full"
                                >
                                    <RotateCw size={28} />
                                </button>
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center gap-4 px-5 py-4 bg-white/5 rounded-2xl border border-white/5">
                                <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors">
                                    {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                                    className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-1">
                                {activeLesson.externalLink && (
                                    <a
                                        href={activeLesson.externalLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-orange-600/10 hover:bg-orange-600/20 text-indigo-300 border border-orange-500/30 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm hover:border-orange-500/50"
                                    >
                                        {language === 'english' ? 'Read on Vedabase' : 'वेदाबेस पर पढ़ें'} <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Playlist Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">{language === 'english' ? 'New Playlist' : 'नई प्लेलिस्ट'}</h3>
                        <input
                            autoFocus
                            type="text"
                            placeholder={language === 'english' ? "Playlist Name" : "प्लेलिस्ट का नाम"}
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-orange-100 outline-none font-medium"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 py-3 text-slate-500 font-bold bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                {language === 'english' ? 'Cancel' : 'रद्द करें'}
                            </button>
                            <button
                                onClick={createPlaylist}
                                disabled={!newPlaylistName.trim()}
                                className="flex-1 py-3 text-white font-bold bg-orange-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-orange-200"
                            >
                                {language === 'english' ? 'Create' : 'बनाएँ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

