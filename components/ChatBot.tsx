import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User as UserIcon, Loader2, Globe } from 'lucide-react';
import { User } from '../types';
import { sendChatMessage, searchWisdom } from '../services/geminiService';

interface ChatBotProps {
  user: User;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
}

export const ChatBot: React.FC<ChatBotProps> = ({ user, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Namaste ${user.name}. I am InnerLight. How is your spirit feeling today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      let responseText = '';
      let responseSources: { title: string; uri: string }[] = [];

      if (useSearch) {
        try {
          const result = await searchWisdom(userMsg);
          responseText = result.text;
          responseSources = result.sources;
        } catch (searchError) {
          console.error('Search Wisdom Error:', searchError);
          responseText = "I couldn't search for that right now. Let me try answering from my knowledge instead.";
          // Fallback to regular chat
          const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          }));
          responseText = await sendChatMessage(userMsg, history, user.belief);
        }
      } else {
        // Convert chat history to Gemini format
        const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

        try {
          responseText = await sendChatMessage(userMsg, history, user.belief);
        } catch (chatError) {
          console.error('Chat Message Error:', chatError);
          // Check if it's an API key error
          if (chatError instanceof Error && chatError.message.includes('API Key')) {
            responseText = "My connection to the spiritual network seems disrupted. The guide may need to check the API configuration.";
          } else {
            responseText = "I'm having a moment of reflection. Could you please try asking again?";
          }
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: responseText, sources: responseSources }]);
    } catch (error) {
      console.error('Chatbot General Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm experiencing a moment of difficulty. Please try again, and I'll do my best to help you." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col md:max-w-md md:right-0 md:left-auto md:shadow-2xl border-l border-slate-100">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <Sparkles size={16} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">InnerLight Guide</h3>
            <p className="text-xs text-slate-500">Powered by Gemini 3 Pro</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">Close</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
              }`}>
              {msg.text}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-indigo-100/50">
                  <p className="text-xs font-semibold mb-1 opacity-70">Sources:</p>
                  <ul className="space-y-1">
                    {msg.sources.map((source, i) => (
                      <li key={i}>
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-indigo-600 block truncate" title={source.title}>
                          {source.title || source.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-indigo-500" />
              <span className="text-xs text-slate-400">Thinking deeply...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setUseSearch(!useSearch)}
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full border ${useSearch ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
          >
            <Globe size={12} />
            {useSearch ? 'Search Enabled' : 'Enable Search'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-700"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};