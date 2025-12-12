
export enum BeliefSystem {
  BUDDHISM = 'Buddhism',
  HINDUISM = 'Hinduism (Gita/Upanishads)',
  JAINISM = 'Jainism',
  SIKHISM = 'Sikhism',
  BIBLE = 'Christianity (Bible)',
  QURAN = 'Islam (Quran)',
  SPIRITUALITY = 'General Spirituality'
}

export interface User {
  userId: string;
  name: string;
  age: number;
  gender?: string;
  email: string;
  phoneNumber?: string;
  belief: BeliefSystem;
  createdAt: string;
  isPremium?: boolean;
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface EmotionAnalysis {
  emotion: string;
  calmingMessage: string;
  spiritualWisdom: string;
  suggestedAction: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface DailyWisdom {
  quote: string;
  source: string;
  date: string;
}

// Helper type for JSON parsing from Gemini
export interface GeminiJSONResponse {
  emotion?: string;
  calmingMessage?: string;
  spiritualWisdom?: string;
  suggestedAction?: string;
  reframedThought?: string;
  explanation?: string;
}

export interface JournalLog {
  id: string;
  timestamp: string;
  text: string;
  analysis: GeminiJSONResponse;
}

export interface Reminder {
  id: string;
  title: string; // e.g., "Morning Journal", "Breathing"
  time: string; // "HH:mm" 24h format
  days: number[]; // 0 = Sunday, 1 = Monday, etc.
  enabled: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'Mind' | 'Spirit' | 'Body' | 'Wisdom';
  locked: boolean;
  completed: boolean;
  color: string;
  videoUrl?: string;
  audioUrl?: string; // New field for Audiobooks
  externalLink?: string; // New field for Vedabase link
  thumbnail?: string;
  language?: 'english' | 'hindi';
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
  color: string;
  isCustom: boolean;
  coverImage?: string;
  language?: 'english' | 'hindi';
  externalLink?: string;
}
