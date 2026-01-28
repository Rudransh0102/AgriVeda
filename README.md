# AgriVeda - Crop Disease Detection App

An AI-powered mobile application built with React Native and Expo for detecting crop diseases through image analysis.

## 🌾 Features

- **Disease Detection**: Take or upload photos of crops to detect diseases
- **Scan History**: Track all previous disease detections
- **Dark Mode**: Full dark/light theme support
- **Modern UI**: Built with NativeWind (Tailwind CSS) and smooth animations
- **Image Picker**: Camera and gallery integration

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app on physical device)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Run on your platform:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 🔌 Backend (FastAPI)

This repo includes a Python backend under `server/`.

- In the **mobile app**, there is no Nginx proxy, so requests must use an absolute base URL.

### Run the backend

From `AgriVeda/server`:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The server listens on `http://0.0.0.0:8000`.

### Configure the mobile app API base URL

Set `EXPO_PUBLIC_API_URL` (note: do NOT include `/api`):

- Physical device: `http://YOUR-LAN-IP:8000`
- Android emulator: `http://10.0.2.2:8000`
- iOS simulator: `http://localhost:8000`

Copy `.env.example` to `.env` if you need a template.

Dev convenience: if `EXPO_PUBLIC_API_URL` is missing or set to `localhost`, the app attempts to infer your dev machine LAN IP from the Expo dev server.

## 🤖 Gemini-Powered Crop Recommendations

The Crops screen uses the Gemini API to generate location/season/soil-based recommendations.

- Set your API key in environment: `EXPO_PUBLIC_GEMINI_API_KEY`
- Copy `.env.example` to `.env` and fill the key
- This key is read at build time by Expo

Quick steps:

```bash
copy .env.example .env
# Edit .env and set EXPO_PUBLIC_GEMINI_API_KEY
npm start
```

If the key is missing, the app shows an error toast on the Crops screen.

Inputs currently used:

- `location` (city/district)
- `soil` (e.g., loam, clay)
- `season` (e.g., kharif, rabi)

Output cards include crop name, profitability, duration, and a short reason.

## 📁 Project Structure

```
AgriVeda/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout with providers
│   └── (tabs)/                  # Tab navigation
│       ├── _layout.tsx          # Tab bar configuration
│       ├── index.tsx            # Home screen
│       ├── detect.tsx           # Disease detection screen
│       ├── history.tsx          # Scan history
│       └── settings.tsx         # Settings screen
├── components/
│   └── ui/
│       └── Toast.tsx            # Toast notification component
├── constants/
│   ├── Colors.ts                # Color palette
│   └── theme.ts                 # Theme system
├── contexts/
│   └── ThemeContext.tsx         # Theme state management
├── lib/
│   └── storage.ts               # AsyncStorage utilities
├── providers/
│   └── index.tsx                # Combined providers
├── assets/                      # Images, fonts, etc.
├── babel.config.js              # Babel configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── global.css                   # Global styles
└── package.json
```

## 🎨 Design System

### Color Palette

- **Primary**: Green (#10B981) - Agriculture theme
- **Secondary**: Light Green (#34D399)
- **Accent**: Amber (#F59E0B) - Disease warnings

### Theme Support

- Automatic dark/light mode switching
- Persisted theme preference
- Comprehensive color system for both themes

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS)
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native
- **State Management**: React Query + Context API
- **Storage**: AsyncStorage
- **Image Handling**: Expo Image Picker
- **TypeScript**: Full type safety

## 📱 Key Screens

### Home

- Quick action cards for main features
- Recent scans overview
- Easy navigation to detection

### Detect

- Camera capture
- Gallery image selection
- Real-time image analysis (placeholder)
- Tips for best results

### History

- List of previous scans
- Disease detection results
- Scan timestamps

### Settings

- Dark/light mode toggle
- Notification preferences
- Help & support
- About information

## 🔧 Configuration

### Babel Config

The app uses React Native Reanimated, which requires the plugin to be last in `babel.config.js`:

```js
plugins: [
  "nativewind/babel",
  "react-native-reanimated/plugin", // Must be last
];
```

### Tailwind Config

NativeWind is configured to scan all relevant files:

```js
content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"];
```

## 🎯 Future Enhancements

- [✅] Integrate actual AI/ML model for disease detection
- [✅] Add disease database with treatment recommendations
- [ ] Implement user authentication
- [ ] Add crop health tracking over time
- [✅] Enable offline mode with local storage
- [✅] Add multi-language support
- [ ] Implement push notifications for disease alerts
- [✅] Add weather integration
- [ ] Create community features for farmers

## 📄 License

This project is part of the Atharva Hackathon.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React Native and Expo
