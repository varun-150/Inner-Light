import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { User } from './types';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('innerlight_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    // Show onboarding if it's a "new" user (based on creation time approx check or just show for demo)
    const isNew = new Date().getTime() - new Date(newUser.createdAt).getTime() < 5000;
    if (isNew) {
      setOnboarding(true);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('innerlight_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('innerlight_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-indigo-600">
        <Loader2 className="animate-spin" size={48} />
      </div>
    )
  }

  // Onboarding Flow
  if (user && onboarding) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-md animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-6">Welcome, {user.name}</h1>
          <p className="text-xl mb-8 opacity-90">We have tailored your experience to the wisdom of <strong>{user.belief}</strong>.</p>

          <div className="bg-white/10 p-6 rounded-2xl mb-8 text-left">
            <h3 className="font-bold mb-2">How InnerLight helps:</h3>
            <ul className="list-disc list-inside space-y-2 opacity-90">
              <li>AI emotion detection analyzes your journals.</li>
              <li>Overthinking tool reframes your worries logically.</li>
              <li>Chat with a spiritual companion anytime.</li>
            </ul>
          </div>

          <button
            onClick={() => setOnboarding(false)}
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-opacity-90 transition-transform hover:scale-105"
          >
            Enter Sanctuary
          </button>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="antialiased">
        {user ? (
          <Dashboard user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
        ) : (
          <Auth onLogin={handleLogin} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;