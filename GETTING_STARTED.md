# ChatApp - Getting Started

A production-ready WhatsApp-style real-time chat application with modern glassmorphism UI, responsive design, and complete backend infrastructure.

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Git

### Local Development

#### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ChatApp
npm run install:all
```

#### 2. Configure Environment

Copy example files and update:

```bash
# Copy backend env
cp backend/.env.example backend/.env

# Copy frontend env  
cp frontend/.env.example frontend/.env
```

Update `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your-super-secret-key-min-16-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-16-chars
CLIENT_URL=http://localhost:5173
```

#### 3. Start Services

**Option A: Using npm scripts (simplest)**

Terminal 1 - Backend:
```bash
npm run dev:backend
# Backend running on http://localhost:5000
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
# Frontend running on http://localhost:5173
```

**Option B: Using Docker (all-in-one)**

```bash
docker-compose up
# Backend on localhost:5000
# Frontend on localhost:5173
# MongoDB on localhost:27017
# Redis on localhost:6379
```

#### 4. Test the App

1. Open **http://localhost:5173**
2. Register a new account
3. Open another browser/incognito tab
4. Register another account
5. Send messages in real-time ✨

## 📁 Project Structure

```
ChatApp/
├── backend/                      # Express + MongoDB
│   ├── src/
│   │   ├── config/              # Database, Redis, Env config
│   │   ├── controllers/         # Route handlers
│   │   ├── middleware/          # Auth, error handling
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API endpoints
│   │   ├── socket/              # Real-time events
│   │   ├── validators/          # Request validation
│   │   ├── services/            # Business logic
│   │   ├── app.js               # Express app
│   │   └── server.js            # Entry point
│   ├── tests/                   # Jest tests
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── chat/            # Chat-specific components
│   │   │   ├── AppShell.jsx     # Main layout
│   │   │   └── ...
│   │   ├── pages/               # Full pages
│   │   │   ├── auth/            # Login/Register
│   │   │   ├── chat/            # Chat dashboard
│   │   │   └── admin/           # Admin panel
│   │   ├── hooks/               # Custom React hooks
│   │   ├── context/             # Auth, Toast contexts
│   │   ├── store/               # Zustand state management
│   │   ├── services/            # API calls
│   │   ├── App.jsx              # Router config
│   │   └── main.jsx             # Entry point
│   ├── .env.example
│   └── tailwind.config.js
│
├── docker-compose.yml           # Local dev environment
├── .env.example                 # Root env template
├── README.md                    # Full documentation
├── DEPLOYMENT.md                # Production deployment
└── PRODUCTION_CHECKLIST.md      # Launch checklist
```

## 🎯 Features

### Chat Features
- ✅ Real-time one-to-one messaging
- ✅ Message search
- ✅ Message editing & deletion
- ✅ Star/favorite messages
- ✅ Media uploads (images, files)
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Chat archiving
- ✅ Unread message counts
- ✅ User profiles
- ✅ User search

### UI/UX
- ✅ iPhone glassmorphism design
- ✅ Dark/Light/Ocean/Rose themes
- ✅ Fully responsive (mobile-first)
- ✅ Smooth animations (Framer Motion)
- ✅ Emoji picker
- ✅ Toast notifications

### Security & Authentication
- ✅ JWT-based auth
- ✅ Bcrypt password hashing
- ✅ Protected routes (frontend)
- ✅ Protected API endpoints
- ✅ Rate limiting
- ✅ CORS properly configured
- ✅ Helmet security headers

### Admin Features
- ✅ User management
- ✅ Chat monitoring
- ✅ Report system
- ✅ Admin-only routes

## 🔌 API Overview

### Authentication
```
POST   /api/auth/register     Register user
POST   /api/auth/login        Login user
```

### Users
```
GET    /api/users             List users
GET    /api/users/:id         User profile
PATCH  /api/users/profile     Update profile
```

### Chats
```
GET    /api/chats             List chats
POST   /api/chats             Create chat
PATCH  /api/chats/:id/archive Archive chat
```

### Messages
```
GET    /api/messages/:chatId  List messages
POST   /api/messages          Send message
PATCH  /api/messages/:id      Edit message
DELETE /api/messages/:id      Delete message
POST   /api/messages/:id/star Star message
```

## 🌐 Real-time Events

```javascript
// Client → Server
socket.emit('send_message', { chatId, text, ... })
socket.emit('typing', { chatId })
socket.emit('stop_typing', { chatId })

// Server → Client
socket.on('receive_message', (message) => ...)
socket.on('user_typing', (data) => ...)
socket.on('message_seen', (data) => ...)
socket.on('user_online', (userId) => ...)
```

## 🧪 Testing

### Manual Testing

```bash
# 1. Start both dev servers
npm run dev:backend
npm run dev:frontend

# 2. Test registration & login
# 3. Test messaging across two browsers
# 4. Test media uploads
# 5. Test real-time features (typing, seen, etc.)
```

### Automated Testing

```bash
# Run backend tests
npm test --prefix backend

# Check coverage
npm test -- --coverage --prefix backend
```

## 🚀 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

**Quick summary:**
1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Set up MongoDB Atlas
4. Configure Cloudinary
5. Update environment variables
6. Run production checks

## 📚 Documentation

- **[README.md](./README.md)** - Complete overview
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** - Launch checklist

## 🛠️ Technology Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Socket.IO Client
- Zustand (State)
- React Router

**Backend**
- Node.js / Express
- MongoDB / Mongoose
- Socket.IO
- JWT Auth
- Bcrypt
- Cloudinary
- Redis (optional, for caching)

**DevOps**
- Docker & Docker Compose
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas

## 💡 Tips

### Development Tips
- Use browser DevTools for React debugging
- Check Network tab for API calls
- Use Console for error messages
- Test with Socket.IO client library in browser

### Common Issues

**Messages not showing?**
```bash
# Check backend logs
npm run dev:backend

# Check frontend console for API errors
# Reload page, try again
```

**Socket connection refused?**
```bash
# Ensure backend is running
# Check VITE_SOCKET_URL in frontend/.env
# Should match backend URL
```

**Database connection error?**
```bash
# Verify MONGO_URI format
# Check IP whitelist if using MongoDB Atlas
# Ensure database is running
```

## 📖 Learning Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

Having issues? 

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. Review [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
3. Check GitHub issues
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment info (OS, Node version, etc.)

---

**Happy chatting! 🚀**

Built with ❤️ using React, Node.js, and Socket.IO
