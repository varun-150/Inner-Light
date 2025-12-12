
import React, { useState } from 'react';
import { User, JournalLog, BeliefSystem } from '../types';
import { X, User as UserIcon, Mail, Phone, Calendar, Heart, PenLine, Check, Camera } from 'lucide-react';

interface ProfileProps {
    user: User;
    onClose: () => void;
    onUpdateUser: (user: User) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onClose, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        age: user.age,
        gender: user.gender || 'Prefer not to say',
        belief: user.belief,
        profileImage: user.profileImage || ''
    });

    // Calculate simple stats from local storage if available
    const getStats = () => {
        try {
            const savedHistory = localStorage.getItem(`innerlight_history_${user.userId}`);
            const logs: JournalLog[] = savedHistory ? JSON.parse(savedHistory) : [];
            return {
                totalEntries: logs.length,
                streak: logs.length > 0 ? 1 : 0 // Simplified streak logic for demo
            };
        } catch (e) {
            return { totalEntries: 0, streak: 0 };
        }
    };

    const stats = getStats();

    const handleSave = () => {
        const updatedUser = {
            ...user,
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            age: formData.age,
            gender: formData.gender,
            belief: formData.belief,
            profileImage: formData.profileImage
        };
        onUpdateUser(updatedUser);
        setIsEditing(false);
    };

    // Placeholder for image upload simulation
    const handleImageClick = () => {
        if (!isEditing) return;
        // In a real app, this would trigger a file input
        const randomAvatars = [
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80"
        ];
        const random = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
        setFormData({ ...formData, profileImage: random });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative">
                {/* Header Background */}
                <div className="h-40 bg-gradient-to-r from-orange-500 to-amber-600 relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10 backdrop-blur-sm"
                    >
                        <X size={20} />
                    </button>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="absolute top-5 left-5 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10 backdrop-blur-sm"
                        >
                            <PenLine size={20} />
                        </button>
                    )}
                </div>

                {/* Profile Picture & Main Info */}
                <div className="px-6 relative pb-8">
                    {/* Centered Image Overlapping Header and Body */}
                    <div className="absolute -top-16 left-0 right-0 flex justify-center z-10">
                        <div 
                            onClick={handleImageClick}
                            className={`w-32 h-32 bg-white p-1.5 rounded-full shadow-xl ${isEditing ? 'cursor-pointer group hover:scale-105 transition-transform' : ''}`}
                        >
                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-300 overflow-hidden relative">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={48} />
                                )}
                                
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="pt-20 text-center">
                        {isEditing ? (
                            <div className="space-y-4">
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="text-2xl font-bold text-slate-800 text-center w-full border-b-2 border-orange-100 focus:border-orange-500 focus:outline-none bg-transparent pb-1"
                                    placeholder="Your Name"
                                />
                                <div className="relative">
                                    <select
                                        value={formData.belief}
                                        onChange={e => setFormData({...formData, belief: e.target.value as BeliefSystem})}
                                        className="block w-full max-w-[240px] mx-auto text-center bg-orange-50 border border-orange-200 text-orange-700 text-sm font-bold rounded-full py-3 px-8 focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer appearance-none shadow-sm"
                                    >
                                        {Object.values(BeliefSystem).map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-orange-700">
                                        {/* Optional Chevron icon */}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">{user.name}</h2>
                                <div className="inline-block px-8 py-2 bg-orange-50 text-orange-700 text-sm font-bold rounded-full border border-orange-100 shadow-sm">
                                    {user.belief}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Check-ins</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.totalEntries}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Streak</p>
                            <p className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-1">
                                <span className="text-orange-500">🔥</span> {stats.streak} <span className="text-sm font-medium text-slate-500">Day</span>
                            </p>
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="mt-8 mb-6 space-y-5">
                        <div className="flex items-center gap-4 text-slate-600">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                <Mail size={18} />
                            </div>
                            <div className="flex-1 overflow-hidden border-b border-slate-50 pb-2">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Email</p>
                                {isEditing ? (
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full text-sm font-medium focus:outline-none bg-transparent"
                                    />
                                ) : (
                                    <p className="text-sm font-medium truncate">{user.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-600">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                <Phone size={18} />
                            </div>
                            <div className="flex-1 border-b border-slate-50 pb-2">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Phone</p>
                                {isEditing ? (
                                    <input 
                                        type="tel" 
                                        value={formData.phoneNumber}
                                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                                        className="w-full text-sm font-medium focus:outline-none bg-transparent"
                                        placeholder="+1 234 567 890"
                                    />
                                ) : (
                                    <p className="text-sm font-medium">{user.phoneNumber || 'Not added'}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-600">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                <Heart size={18} />
                            </div>
                            <div className="flex-1 border-b border-slate-50 pb-2">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Age</p>
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            value={formData.age}
                                            onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                                            className="w-16 text-sm font-medium focus:outline-none bg-transparent"
                                        />
                                        <span className="text-sm text-slate-500">Years Old</span>
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium">{user.age} Years Old</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-600">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                <UserIcon size={18} />
                            </div>
                            <div className="flex-1 border-b border-slate-50 pb-2">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Gender</p>
                                {isEditing ? (
                                    <select 
                                        value={formData.gender}
                                        onChange={e => setFormData({...formData, gender: e.target.value})}
                                        className="w-full text-sm font-medium focus:outline-none bg-transparent"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                ) : (
                                    <p className="text-sm font-medium">{user.gender || 'Not specified'}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-600">
                             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                <Calendar size={18} />
                            </div>
                            <div className="flex-1 border-b border-slate-50 pb-2">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Member Since</p>
                                <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 mb-2 animate-fade-in-up">
                            <button 
                                onClick={() => { setIsEditing(false); setFormData({...user, phoneNumber: user.phoneNumber || '', profileImage: user.profileImage || ''}); }}
                                className="flex-1 py-3.5 text-slate-500 font-bold bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex-1 py-3.5 text-white font-bold bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                            >
                                <Check size={18} /> Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

