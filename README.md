<div align="center">
  <h1 style="font-size: 3rem; font-weight: bold; color: #f97316;">INNERLIGHT</h1>
  <h3>Spiritual & Mental Wellness Platform</h3>
  <p>Bridging the gap between ancient spiritual wisdom and modern mental wellness.</p>
</div>

---

## 🌟 Overview

**InnerLight** is a comprehensive wellness application designed to help users achieve mental clarity and spiritual growth. It combines mood tracking, daily wisdom, breathing exercises, and a curated library of spiritual audiobooks into a single, cohesive experience. The application features a beautiful, spiritually aligned "Orange & Yellow" theme that evokes energy, warmth, and positivity.

## ✨ Key Features

### 🎧 Audiobook Library
A rich collection of spiritual texts including:
*   **The Bhagavad Gita**: Complete classes and audios.
*   **Srimad Bhagavatham**: Narrations by Amala Bhakta Dasa.
*   **The Ramayanam**: The epic tale of Lord Rama.
*   **Features**: Custom high-quality cover art and seamless external playback.

### 🛡️ Secure Authentication (OTP)
Blocked and secure signup process powered by **Fast2SMS**:
*   **Real SMS Verification**: Users must verify their phone number via 6-digit OTP to create an account.
*   **Smart Fallback**: Includes a "Mock Mode" for development that allows testing the full flow even without an active SMS plan.
*   **Secure Storage**: OTPs are generated on the backend and have a 5-minute expiry.

### 🧘 Spiritual Dashboard
*   **Mood Tracking**: Log your daily emotional state and get tailored advice.
*   **Daily Wisdom**: Receive a new spiritual quote every day.
*   **Breathing Tools**: Interactive 4-7-8 breathing focus tool.
*   **Dynamic Theming**: Toggle between a vibrant **Light Mode** (Sun/Energy) and a deep **Dark Mode** (Moon/Reflection).

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React (TypeScript) + Vite
*   **Styling**: Tailwind CSS + Custom CSS Variables
*   **Icons**: Lucide React
*   **State**: React Context API (Theme, Auth)

### Backend
*   **Runtime**: Node.js
*   **Server**: Express.js
*   **SMS Gateway**: Fast2SMS (Bulk V2 API)
*   **HTTP Client**: Axios

## 🚀 Getting Started

Follow these steps to run the application locally.

### Prerequisites
*   Node.js (v14 or higher)
*   npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/innerlight.git
    cd innerlight
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

### Configuration

Create a `.env` file in the `backend/` directory to enable SMS features:
```env
PORT=5000
FAST2SMS_API_KEY=your_fast2sms_api_key_here
```
*(Note: If you don't have an API key, the system will automatically use "Mock Mode" and print OTPs to the console.)*

### Running the App

You need to run the Frontend and Backend in separate terminals.

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```
*Expected Output: `🚀 InnerLight Backend running on http://localhost:5000`*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*Opens the app at `http://localhost:3000`*

---

<div align="center">
  <p>Made with ❤️ for Inner Peace</p>
</div>
