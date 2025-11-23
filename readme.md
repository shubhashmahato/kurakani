# Kurakani - Ultimate Chat & Social Media App

**The most customizable messaging and social media platform combining the best features of WhatsApp, IMO, Instagram, and Telegram.**

![Kurakani Banner](https://via.placeholder.com/1200x400/075E54/FFFFFF?text=Kurakani+-+Chat+%26+Social+Media)

## 🌟 Features

### Core Messaging
- ✅ 1-on-1 chats with end-to-end encryption
- ✅ Group chats (up to 10,000 members)
- ✅ Secret chats with self-destruct timer
- ✅ Rich media support (images, videos, voice, documents, GIFs, stickers)
- ✅ Message reactions, replies, forwarding
- ✅ Message editing & deletion
- ✅ Read receipts & typing indicators
- ✅ Star messages, search in chat
- ✅ Pin/Archive/Mute chats

### Stories & Status
- ✅ 24-hour stories (text, image, video)
- ✅ Custom backgrounds, fonts, colors
- ✅ Privacy controls (who can view)
- ✅ Reactions & replies

### Voice & Video Calls
- ✅ HD voice & video calls
- ✅ Group voice calls (up to 50 people)
- ✅ Group video calls (up to 8 people)
- ✅ Screen sharing
- ✅ Call logs & history

### Channels (Telegram-style)
- ✅ Public & private channels
- ✅ Unlimited subscribers
- ✅ Admin controls & slow mode
- ✅ Message signatures

### 🎨 EXTREME CUSTOMIZATION
- ✅ **50+ Preset Themes** + Custom theme creator
- ✅ **Chat Bubble Styles** (iOS, Android, WhatsApp, Telegram, etc.)
- ✅ **20+ Fonts** + custom font upload
- ✅ **10+ App Icons** (changeable in-app)
- ✅ **Custom Sounds** (notifications, ringtones, message sounds)
- ✅ **Layout Options** (Tabs, Sidebar, Bottom bar)
- ✅ **Chat Backgrounds** (solid, gradient, image, blur)
- ✅ **Tick Styles** (customize color & shape)
- ✅ **Emoji Styles** (iOS, Android, Twitter, Facebook)

### Security & Privacy
- ✅ App lock (PIN, biometric)
- ✅ Individual chat locks
- ✅ Screenshot detection alerts
- ✅ Privacy settings (last seen, profile photo, about, status)
- ✅ Block, report, mute users

## 🛠 Tech Stack

### Backend
- **Node.js** + Express + TypeScript
- **MongoDB** with Mongoose
- **Socket.io** for real-time communication
- **Redis** for scaling
- **Firebase Auth** for authentication
- **Firebase Storage** + Cloudinary for media
- **Agora.io** for video/audio calls

### Frontend
- **React Native** with Expo SDK 52+
- **Expo Router** (file-based routing)
- **TypeScript**
- **NativeWind** (Tailwind CSS)
- **Zustand** for state management
- **Socket.io Client** for real-time

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Redis (optional, for scaling)
- Firebase account
- Agora.io account (free tier)
- Expo CLI: `npm install -g expo-cli`

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/kurakani.git
cd kurakani/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:
- MongoDB URI
- Firebase Admin SDK credentials
- Cloudinary credentials
- Agora App ID & Certificate
- JWT Secret

4. **Start the server**
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your:
- Backend API URL
- Firebase config (from Firebase Console)
- Agora App ID
- Google Maps API Key

4. **Start Expo**
```bash
npx expo start
```

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "Kurakani" and follow the wizard

### 2. Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable:
   - Email/Password
   - Google
   - Apple (iOS only)
   - Phone

### 3. Setup Firebase Admin SDK (Backend)
1. Go to **Project Settings** → **Service Accounts**
2. Click "Generate New Private Key"
3. Download the JSON file
4. Extract credentials to `.env`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`

### 4. Setup Firebase Web SDK (Frontend)
1. Go to **Project Settings** → **General**
2. Add a web app
3. Copy the config to frontend `.env`

### 5. Setup Firebase Storage
1. Go to **Storage** → **Get Started**
2. Setup security rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Download google-services.json
- For Android: Download and place in `frontend/`
- For iOS: Download GoogleService-Info.plist

## 🎙 Agora.io Setup

1. **Create Account**: [Agora.io](https://www.agora.io/)
2. **Create Project**:
   - Dashboard → Projects → Create
   - Choose "Secured mode: APP ID + Token"
3. **Get Credentials**:
   - Copy APP ID → Add to both `.env` files
   - Generate temporary token for testing
   - For production, implement token generation on backend

## 🗄 MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB
brew install mongodb-community  # macOS
# or download from mongodb.com

# Start MongoDB
brew services start mongodb-community

# Connection string:
MONGODB_URI=mongodb://localhost:27017/kurakani
```

### MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kurakani
```

## 🚀 Running the App

### Development

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
# iOS
eas build --platform ios
# Android
eas build --platform android
```

## 📱 Features Implementation Status

| Feature | Status |
|---------|--------|
| Authentication (Firebase) | ✅ Complete |
| Real-time Messaging | ✅ Complete |
| Group Chats | ✅ Complete |
| Secret Chats | ✅ Complete |
| Voice/Video Calls | ✅ Complete |
| Stories/Status | ✅ Complete |
| Channels | ✅ Complete |
| Theme Customization | ✅ Complete |
| Push Notifications | ✅ Complete |
| Media Upload | ✅ Complete |
| Search | ✅ Complete |
| Privacy Settings | ✅ Complete |
| App Lock | ✅ Complete |

## 🎨 Customization Guide

### Changing Themes
Users can customize themes from **Settings** → **Appearance**:
1. Choose from 50+ presets
2. Or create custom theme:
   - Primary color
   - Accent color
   - Background gradient
   - Chat bubble style
   - Font family

### Changing App Icon
**Settings** → **Appearance** → **App Icon**
- 10+ built-in icons
- Changes instantly (no restart required)

### Custom Sounds
**Settings** → **Notifications** → **Sounds**
- Upload custom notification sound
- Change ringtone
- Customize vibration pattern

## 🔒 Security Features

- End-to-end encryption for secret chats
- Firebase Authentication
- JWT token validation
- App lock with PIN or biometric
- Individual chat locks
- Screenshot detection
- Self-destructing messages
- Encrypted media uploads

## 📊 Database Schema

See detailed schemas in:
- `backend/src/models/User.ts`
- `backend/src/models/Chat.ts`
- `backend/src/models/Message.ts`
- `backend/src/models/Story.ts`
- `backend/src/models/Call.ts`
- `backend/src/models/Channel.ts`

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 API Documentation

API runs on `http://localhost:5000/api`

### Auth Endpoints
- `POST /api/auth/firebase` - Login with Firebase
- `GET /api/auth/me` - Get current user
- `POST /api/auth/push-token` - Update push token
- `POST /api/auth/logout` - Logout

### User Endpoints
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `GET /api/users/search?q=query` - Search users
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/privacy` - Update privacy settings
- `PUT /api/users/theme` - Update theme

### Chat Endpoints
- `GET /api/chats` - Get all chats
- `POST /api/chats` - Create private/secret chat
- `POST /api/chats/group` - Create group chat
- `GET /api/messages/:chatId` - Get messages
- `POST /api/messages` - Send message

See full API docs in Postman collection (coming soon).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for authentication & storage
- Agora.io for video/audio calls
- Socket.io for real-time communication
- Expo team for amazing mobile framework
- MongoDB for flexible database

## 📞 Support

- **Email**: support@kurakani.app
- **Discord**: [Join our community](https://discord.gg/kurakani)
- **Twitter**: [@KurakaniApp](https://twitter.com/kurakaniapp)
- **Documentation**: [docs.kurakani.app](https://docs.kurakani.app)

## 🗺 Roadmap

- [ ] Voice rooms (Clubhouse-style)
- [ ] Live streaming
- [ ] Mini apps/Bots framework
- [ ] Desktop apps (Windows, macOS, Linux)
- [ ] Web version
- [ ] Message translation
- [ ] AI chatbot integration
- [ ] Cryptocurrency wallet
- [ ] NFT profile pictures

---

**Made with ❤️ by the Kurakani Team**

⭐ Star us on GitHub if you like this project!
