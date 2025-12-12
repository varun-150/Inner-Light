
import React, { useState, useEffect } from 'react';
import { Reminder } from '../types';
import { Bell, X, Plus, Trash2, Check, Clock } from 'lucide-react';

interface RemindersProps {
  onClose: () => void;
}

export const Reminders: React.FC<RemindersProps> = ({ onClose }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // New Reminder Form State
  const [newTitle, setNewTitle] = useState('Daily Journal');
  const [newTime, setNewTime] = useState('08:00');
  const [newDays, setNewDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]); // Default all days

  useEffect(() => {
    // Load reminders
    const saved = localStorage.getItem('innerlight_reminders');
    if (saved) {
        setReminders(JSON.parse(saved));
    }

    // Request permission on mount if not granted/denied
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
  }, []);

  const saveReminders = (updated: Reminder[]) => {
      setReminders(updated);
      localStorage.setItem('innerlight_reminders', JSON.stringify(updated));
  };

  const handleAdd = () => {
      if (Notification.permission !== 'granted') {
          Notification.requestPermission();
      }

      const reminder: Reminder = {
          id: Date.now().toString(),
          title: newTitle,
          time: newTime,
          days: newDays,
          enabled: true
      };

      saveReminders([...reminders, reminder]);
      setIsAdding(false);
      // Reset form defaults
      setNewTitle('Daily Journal');
      setNewTime('08:00');
      setNewDays([0, 1, 2, 3, 4, 5, 6]);
  };

  const toggleReminder = (id: string) => {
      const updated = reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
      saveReminders(updated);
  };

  const deleteReminder = (id: string) => {
      const updated = reminders.filter(r => r.id !== id);
      saveReminders(updated);
  };

  const toggleDay = (dayIndex: number) => {
      setNewDays(prev => 
          prev.includes(dayIndex) 
            ? prev.filter(d => d !== dayIndex) 
            : [...prev, dayIndex].sort()
      );
  };

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                        <Bell size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Reminders</h2>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
                
                {/* Add Form */}
                {isAdding ? (
                    <div className="bg-white border-2 border-orange-100 rounded-2xl p-4 mb-6 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Activity</label>
                                <select 
                                    value={newTitle} 
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full mt-1 p-2 bg-slate-50 rounded-lg border border-slate-200 font-medium"
                                >
                                    <option>Daily Journal</option>
                                    <option>Breathing Exercise</option>
                                    <option>Mala Beads</option>
                                    <option>Grounding</option>
                                    <option>Spiritual Reading</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Time</label>
                                <input 
                                    type="time" 
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                    className="w-full mt-1 p-2 bg-slate-50 rounded-lg border border-slate-200 font-medium"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Repeat</label>
                                <div className="flex justify-between">
                                    {daysOfWeek.map((day, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => toggleDay(idx)}
                                            className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                                                newDays.includes(idx) 
                                                    ? 'bg-orange-600 text-white' 
                                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button onClick={() => setIsAdding(false)} className="flex-1 py-2 text-slate-500 font-medium hover:bg-slate-50 rounded-lg">Cancel</button>
                                <button onClick={handleAdd} className="flex-1 py-2 bg-orange-600 text-white font-medium rounded-lg shadow-md shadow-orange-200">Save</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all mb-6"
                    >
                        <Plus size={20} /> Add New Reminder
                    </button>
                )}

                {/* List */}
                <div className="space-y-3">
                    {reminders.length === 0 && !isAdding && (
                        <p className="text-center text-slate-400 text-sm py-4">No reminders set. Create one to build a habit.</p>
                    )}
                    {reminders.map(rem => (
                        <div key={rem.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${rem.enabled ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4 className={`font-bold ${rem.enabled ? 'text-slate-800' : 'text-slate-400'}`}>{rem.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span className="font-mono">{rem.time}</span>
                                        <span>•</span>
                                        <span>
                                            {rem.days.length === 7 ? 'Everyday' : 
                                             rem.days.length === 0 ? 'Once' : 
                                             rem.days.map(d => daysOfWeek[d]).join(' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => toggleReminder(rem.id)}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${rem.enabled ? 'bg-green-500' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${rem.enabled ? 'left-7' : 'left-1'}`}></div>
                                </button>
                                <button onClick={() => deleteReminder(rem.id)} className="text-slate-300 hover:text-red-400 p-1">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
                Reminders only work when the app is open in a tab.
            </div>
        </div>
    </div>
  );
};

