# Kurakani Backend

Node.js + Express + TypeScript + MongoDB + Socket.io backend for Kurakani chat app.

## Features

- ✅ RESTful API with Express
- ✅ Real-time communication with Socket.io
- ✅ MongoDB with Mongoose ODM
- ✅ Redis adapter for Socket.io scaling
- ✅ Firebase Authentication
- ✅ Firebase Storage for media
- ✅ JWT token authentication
- ✅ TypeScript for type safety
- ✅ Docker support
- ✅ Comprehensive error handling
- ✅ Request validation
- ✅ CORS enabled
- ✅ Rate limiting
- ✅ Compression
- ✅ Helmet security

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   │   ├── database.ts    # MongoDB connection
│   │   ├── firebase.ts    # Firebase Admin SDK
│   │   ├── socket.ts      # Socket.io setup
│   │   └── cloudinary.ts  # Cloudinary config
│   ├── controllers/    # Request handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── chatController.ts
│   │   ├── messageController.ts
│   │   ├── storyController.ts
│   │   ├── callController.ts
│   │   └── channelController.ts
│   ├── models/         # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Chat.ts
│   │   ├── Message.ts
│   │   ├── Story.ts
│   │   ├── Call.ts
│   │   └── Channel.ts
│   ├── routes/         # API routes
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── chats.ts
│   │   ├── messages.ts
│   │   ├── stories.ts
│   │   ├── calls.ts
│   │   └── channels.ts
│   ├── middleware/     # Custom middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── services/       # Business logic
│   │   ├── socketService.ts
│   │   ├── storageService.ts
│   │   ├── notificationService.ts
│   │   └── encryptionService.ts
│   ├── utils/          # Helper functions
│   │   ├── logger.ts
│   │   ├── errorHandler.ts
│   │   └── validators.ts
│   └── app.ts          # Main application file
├── .env.example        # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Installation

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Redis (optional, for scaling)
- Firebase account
- Agora.io account

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/kurakani

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Agora.io
AGORA_APP_ID=your-app-id
AGORA_APP_CERTIFICATE=your-certificate

# Push Notifications
FCM_SERVER_KEY=your-fcm-key

# Encryption
ENCRYPTION_KEY=your-32-char-encryption-key
```

3. **Start MongoDB**
```bash
# Using Docker
docker-compose up -d mongodb

# Or start local MongoDB
brew services start mongodb-community
```

4. **Run development server**
```bash
npm run dev
```

Server will start on http://localhost:5000

## Docker Setup

### Development with Docker Compose

```bash
# Start all services (MongoDB, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

### Production Docker

```bash
# Build image
docker build -t kurakani-backend .

# Run container
docker run -p 5000:5000 --env-file .env kurakani-backend
```

## API Endpoints

### Authentication

```
POST   /api/auth/firebase          # Login with Firebase token
GET    /api/auth/me                # Get current user
POST   /api/auth/push-token        # Update push notification token
POST   /api/auth/logout            # Logout
```

### Users

```
GET    /api/users/:id              # Get user by ID
GET    /api/users/username/:username  # Get user by username
GET    /api/users/search?q=query   # Search users
PUT    /api/users/profile          # Update profile
PUT    /api/users/privacy          # Update privacy settings
PUT    /api/users/theme            # Update theme
PUT    /api/users/notifications    # Update notification settings
POST   /api/users/:id/block        # Block user
POST   /api/users/:id/unblock      # Unblock user
```

### Chats

```
GET    /api/chats                  # Get all chats
GET    /api/chats/:id              # Get chat by ID
POST   /api/chats                  # Create private/secret chat
POST   /api/chats/group            # Create group chat
PUT    /api/chats/:id              # Update chat
DELETE /api/chats/:id              # Delete chat
```

### Messages

```
GET    /api/messages/:chatId       # Get messages
POST   /api/messages               # Send message
PUT    /api/messages/:messageId    # Edit message
DELETE /api/messages/:messageId    # Delete message
POST   /api/messages/:messageId/react  # React to message
POST   /api/messages/read          # Mark as read
GET    /api/messages/:chatId/search?q=query  # Search messages
```

### Stories

```
GET    /api/stories                # Get stories
POST   /api/stories                # Create story
POST   /api/stories/:id/view       # View story
POST   /api/stories/:id/react      # React to story
POST   /api/stories/:id/reply      # Reply to story
DELETE /api/stories/:id            # Delete story
```

### Calls

```
POST   /api/calls/initiate         # Initiate call
GET    /api/calls/history          # Get call history
POST   /api/calls/:id/end          # End call
```

### Channels

```
GET    /api/channels               # Get subscribed channels
GET    /api/channels/:username     # Get channel by username
POST   /api/channels               # Create channel
POST   /api/channels/:id/subscribe # Subscribe to channel
POST   /api/channels/:id/unsubscribe  # Unsubscribe
```

## Socket.io Events

### Client → Server

```javascript
// Connection
socket.emit('chat:join', chatId)
socket.emit('chat:leave', chatId)

// Typing
socket.emit('typing:start', { chatId })
socket.emit('typing:stop', { chatId })

// Messages
socket.emit('message:send', messageData)
socket.emit('message:delivered', { messageId, chatId })
socket.emit('message:read', { messageId, chatId })
socket.emit('message:react', { messageId, chatId, emoji })
socket.emit('message:delete', { messageId, chatId })
socket.emit('message:edit', { messageId, chatId, content })

// Calls
socket.emit('call:initiate', callData)
socket.emit('call:accept', { callId })
socket.emit('call:reject', { callId })
socket.emit('call:end', { callId })

// Stories
socket.emit('story:view', { storyId, userId })
```

### Server → Client

```javascript
// User status
socket.on('user:online', ({ userId }))
socket.on('user:offline', ({ userId, lastSeen }))

// Messages
socket.on('message:new', ({ message, chatId }))
socket.on('message:delivered', ({ messageId, userId }))
socket.on('message:read', ({ messageId, userId }))
socket.on('message:react', ({ messageId, userId, emoji }))
socket.on('message:delete', ({ messageId }))
socket.on('message:edit', ({ messageId, content }))

// Typing
socket.on('typing:start', ({ userId, chatId }))
socket.on('typing:stop', ({ userId, chatId }))

// Calls
socket.on('call:incoming', callData)
socket.on('call:accepted', { callId })
socket.on('call:rejected', { callId })
socket.on('call:ended', { callId })

// Stories
socket.on('story:viewed', ({ viewerId, storyId }))
```

## Database Models

### User Schema
- Profile information (name, username, bio, pictures)
- Privacy settings (last seen, profile photo, read receipts)
- Theme customization (colors, bubble style, fonts)
- Notification settings
- App lock settings
- Contacts, blocked users
- Pinned/archived chats
- Starred messages

### Chat Schema
- Type (private, group, secret)
- Participants
- Group settings (admins, permissions)
- Secret chat settings (encryption, self-destruct)
- Last message
- Unread counts per user

### Message Schema
- All message types (text, media, voice, location, etc.)
- Reply, forward, reactions
- Read receipts, delivery status
- Edit history
- Deletion (for self or everyone)
- Mentions
- Encryption support

### Story Schema
- Type (text, image, video)
- Customization (colors, fonts)
- Privacy (visibility, custom viewers)
- Views, reactions, replies
- Auto-expiry (24 hours)

### Call Schema
- Type (voice, video)
- Participants
- Status (initiated, ongoing, ended, missed)
- Agora channel info
- Duration, timestamps
- Screen sharing info

### Channel Schema
- Public/private
- Owner, admins, subscribers
- Settings (slow mode, signatures)
- Statistics (subscriber count, posts, views)
- Verification status

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 5000) |
| NODE_ENV | Environment (development/production) | Yes |
| MONGODB_URI | MongoDB connection string | Yes |
| REDIS_HOST | Redis host | No |
| REDIS_PORT | Redis port | No |
| JWT_SECRET | Secret key for JWT | Yes |
| JWT_EXPIRE | JWT expiration time | No (default: 7d) |
| FIREBASE_PROJECT_ID | Firebase project ID | Yes |
| FIREBASE_PRIVATE_KEY | Firebase private key | Yes |
| FIREBASE_CLIENT_EMAIL | Firebase client email | Yes |
| FIREBASE_STORAGE_BUCKET | Firebase storage bucket | Yes |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | No |
| CLOUDINARY_API_KEY | Cloudinary API key | No |
| CLOUDINARY_API_SECRET | Cloudinary API secret | No |
| AGORA_APP_ID | Agora app ID | Yes |
| AGORA_APP_CERTIFICATE | Agora certificate | Yes |
| FCM_SERVER_KEY | FCM server key | No |
| ENCRYPTION_KEY | Encryption key (32 chars) | Yes |
| ALLOWED_ORIGINS | CORS allowed origins | No |

## Security

- JWT authentication for all protected routes
- Firebase token verification
- CORS configuration
- Helmet for HTTP headers security
- Rate limiting on API endpoints
- Input validation and sanitization
- Password hashing (if using email/password)
- Encrypted secret chats
- Secure media uploads

## Performance

- Database indexing for fast queries
- Redis caching (optional)
- Connection pooling
- Response compression
- Efficient Socket.io with Redis adapter
- Optimized queries with Mongoose
- File size limits on uploads

## Monitoring & Logging

- Morgan for HTTP request logging
- Custom error logging
- Socket.io connection logs
- Database query logging (development)

## Deployment

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### DigitalOcean App Platform
1. Create new app
2. Link repository
3. Configure environment variables
4. Deploy

### Heroku
```bash
# Login
heroku login

# Create app
heroku create kurakani-api

# Add MongoDB addon
heroku addons:create mongolab

# Deploy
git push heroku main
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongosh

# Check connection string format
mongodb://localhost:27017/kurakani  # Local
mongodb+srv://user:pass@cluster.mongodb.net/kurakani  # Atlas
```

### Socket.io Connection Issues
- Verify CORS configuration
- Check firewall rules
- Ensure WebSocket support on hosting platform

### Firebase Issues
- Verify all Firebase credentials
- Check service account permissions
- Ensure Storage bucket exists

### Performance Issues
- Enable Redis for Socket.io scaling
- Add database indexes
- Use MongoDB Atlas with proper tier
- Enable compression

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

MIT

## Support

- Email: support@kurakani.app
- Discord: [discord.gg/kurakani](https://discord.gg/kurakani)
- Issues: [github.com/kurakani/issues](https://github.com/kurakani/issues)
