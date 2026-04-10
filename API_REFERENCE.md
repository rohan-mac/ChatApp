# ChatApp - Complete API & Architecture Reference

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Chat UI     │  │  Auth Pages  │  │ Admin Panel  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│                    ┌──────▼─────────┐                        │
│                    │ Zustand Store  │                        │
│                    │ + Socket.IO    │                        │
│                    └──────┬─────────┘                        │
└─────────────────────────────┼────────────────────────────────┘
                              │
                              │ HTTP + WebSocket
                              │
┌─────────────────────────────▼────────────────────────────────┐
│              Backend (Express + Socket.IO)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express Server (Port 5000)                          │   │
│  │  ┌──────────────┐  ┌──────────────┐                 │   │
│  │  │ API Routes   │  │ Socket.IO    │                 │   │
│  │  │ - Auth       │  │ - Messages   │                 │   │
│  │  │ - Users      │  │ - Presence   │                 │   │
│  │  │ - Chats      │  │ - Typing     │                 │   │
│  │  │ - Messages   │  │ - Status     │                 │   │
│  │  │ - Admin      │  └──────────────┘                 │   │
│  │  └──────────────┘                                   │   │
│  │         │              │                            │   │
│  │         └──────────────┼────────────────┐           │   │
│  │                        │                │           │   │
│  │         ┌──────────────┴──────┐     ┌───▼─────┐     │   │
│  │         │ Controllers         │     │Middleware   │   │   │
│  │         │ - authController    │     │- Auth       │   │   │
│  │         │ - chatController    │     │- Validation │   │   │
│  │         │ - messageController │     │- Error      │   │   │
│  │         │ - userController    │     │- Rate Limit │   │   │
│  │         └─────────┬──────────┘     └─────────┘     │   │
│  │                   │                                │   │
│  │         ┌─────────▼──────────┐                    │   │
│  │         │ Services            │                    │   │
│  │         │ - tokenService      │                    │   │
│  │         │ - mediaService      │                    │   │
│  │         │ - spamService       │                    │   │
│  │         └────────┬────────────┘                    │   │
│  │                  │                                │   │
│  │         ┌────────▼────────┐                       │   │
│  │         │ Models (MongoDB) │                       │   │
│  │         │ - User          │                       │   │
│  │         │ - Chat          │                       │   │
│  │         │ - Message       │                       │   │
│  │         │ - RefreshToken  │                       │   │
│  │         │ - Report        │                       │   │
│  │         └─────────────────┘                       │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────┘
                   │
      ┌────────────┼────────────┬────────────┐
      │            │            │            │
   ┌──▼──┐    ┌───▼──┐    ┌────▼────┐  ┌───▼──┐
   │ MongoDB   │ Redis   │ Cloudinary  │ JWT │
   │ (Data)    │ (Cache) │ (Media)     │ Auth │
   └─────┘    └────────┘ └───────────┘ └──────┘
```

## Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String,              // Display name
  email: String,             // Unique
  passwordHash: String,      // Bcrypt hashed
  profilePic: String,        // Cloudinary URL
  bio: String,
  status: String,            // Custom status message
  isOnline: Boolean,
  lastSeen: DateTime,
  role: String,              // 'user' | 'admin'
  isVerified: Boolean,
  blockedUsers: ObjectId[],  // Array of blocked user IDs
  themePreference: String,   // 'dark' | 'light' | 'ocean' | 'rose'
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Chat Model

```javascript
{
  _id: ObjectId,
  participants: ObjectId[],        // 2 user IDs for 1-1, multiple for groups
  title: String,                   // For group chats
  lastMessage: {
    senderId: ObjectId,
    text: String,
    createdAt: DateTime
  },
  isArchived: Boolean,
  unreadCount: Number,             // Per user tracking
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Message Model

```javascript
{
  _id: ObjectId,
  chatId: ObjectId,                // Reference to Chat
  senderId: ObjectId,              // Reference to User
  text: String,                    // Message content
  content: String,                 // Alternative text field
  mediaUrl: String,                // Cloudinary URL
  mediaType: String,               // 'image' | 'video' | 'file'
  messageType: String,             // 'text' | 'media' | 'system'
  isDeleted: Boolean,
  deletedForEveryone: Boolean,
  deletedFor: ObjectId[],          // Array of user IDs
  starredBy: ObjectId[],           // Users who starred this
  isEdited: Boolean,
  editedAt: DateTime,
  seenBy: [{
    userId: ObjectId,
    seenAt: DateTime
  }],
  clientMessageId: String,         // For optimistic UI
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### RefreshToken Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to User
  token: String,                   // Hashed token
  expiresAt: DateTime,
  createdAt: DateTime
}
```

## Complete API Reference

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (201):
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePic": "",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200): Same as register response
```

### User Endpoints

#### Get All Users
```
GET /api/users?search=john&page=1&limit=20
Authorization: Bearer {accessToken}

Response (200):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePic": "https://cloudinary.com/...",
      "isOnline": true,
      "lastSeen": "2024-04-10T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "hasMore": true
  }
}
```

#### Get User Profile
```
GET /api/users/:userId
Authorization: Bearer {accessToken}

Response (200):
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePic": "https://cloudinary.com/...",
    "bio": "Software Developer",
    "status": "Available",
    "isOnline": true,
    "lastSeen": "2024-04-10T10:30:00Z",
    "role": "user"
  }
}
```

#### Update Profile
```
PATCH /api/users/profile
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Request:
{
  "name": "John Updated",
  "bio": "New bio",
  "profilePic": <file>  // Optional
}

Response (200):
{
  "user": { /* updated user */ }
}
```

### Chat Endpoints

#### Get Chats
```
GET /api/chats?archived=false&search=query&page=1&limit=20
Authorization: Bearer {accessToken}

Response (200):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "participants": ["userId1", "userId2"],
      "counterpart": {
        "_id": "userId2",
        "name": "Jane Doe",
        "isOnline": true
      },
      "lastMessageId": {
        "text": "Hello!",
        "createdAt": "2024-04-10T10:30:00Z"
      },
      "unreadCount": 3,
      "updatedAt": "2024-04-10T10:30:00Z"
    }
  ]
}
```

#### Create Chat
```
POST /api/chats
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "receiverId": "507f1f77bcf86cd799439011"
}

Response (201):
{
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "participants": ["myUserId", "receiverId"],
    "counterpart": { /* recipient data */ },
    "lastMessageId": null,
    "unreadCount": 0
  }
}
```

#### Archive Chat
```
PATCH /api/chats/:chatId/archive
Authorization: Bearer {accessToken}

Response (200):
{
  "message": "Chat archived successfully"
}
```

### Message Endpoints

#### Get Messages
```
GET /api/messages/:chatId?page=1&limit=50
Authorization: Bearer {accessToken}

Response (200):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "chatId": "507f1f77bcf86cd799439012",
      "senderId": {
        "_id": "userId1",
        "name": "John Doe"
      },
      "text": "Hello!",
      "messageType": "text",
      "starredBy": ["userId2"],
      "seenBy": [{
        "userId": "userId2",
        "seenAt": "2024-04-10T10:31:00Z"
      }],
      "createdAt": "2024-04-10T10:30:00Z",
      "updatedAt": "2024-04-10T10:30:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

#### Send Message
```
POST /api/messages
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Request:
{
  "chatId": "507f1f77bcf86cd799439012",
  "text": "Hello!",
  "clientMessageId": "unique-id-for-optimistic-ui",
  "file": <file>  // Optional
}

Response (201):
{
  "message": {
    "_id": "507f1f77bcf86cd799439013",
    /* full message object */
  }
}
```

#### Edit Message
```
PATCH /api/messages/:messageId
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "text": "Updated message"
}

Response (200):
{
  "message": { /* updated message */ }
}
```

#### Delete Message
```
DELETE /api/messages/:messageId
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "scope": "me"  // 'me' | 'everyone'
}

Response (200):
{
  "message": "Message deleted"
}
```

#### Star Message
```
POST /api/messages/:messageId/star
Authorization: Bearer {accessToken}

Response (200):
{
  "message": { /* message with updated starredBy */ }
}
```

### Admin Endpoints

#### Get All Users (Admin)
```
GET /api/admin/users?search=query&page=1
Authorization: Bearer {accessToken}  // Admin only

Response (200):
{
  "data": [
    { /* user objects */ }
  ],
  "pagination": { /* ... */ }
}
```

#### Block User
```
PATCH /api/users/moderation/block/:userId
Authorization: Bearer {accessToken}  // Admin

Response (200):
{
  "message": "User blocked"
}
```

#### Delete User
```
DELETE /api/admin/user/:userId
Authorization: Bearer {accessToken}  // Admin only

Response (200):
{
  "message": "User deleted"
}
```

## Socket.IO Events

### Client → Server Events

```javascript
// Connect & Auth
socket.on('connect', () => {
  // Automatically authenticated via JWT
})

// Join Chat
socket.emit('chat:join', { chatId: '507f1f77bcf86cd799439012' })

// Leave Chat
socket.emit('chat:leave', { chatId: '507f1f77bcf86cd799439012' })

// Send Message
socket.emit('message:send', {
  chatId: '507f1f77bcf86cd799439012',
  text: 'Hello!',
  clientMessageId: 'unique-id'
})

// Typing Indicator
socket.emit('chat:typing', {
  chatId: '507f1f77bcf86cd799439012',
  senderId: 'userId'
})

// Stop Typing
socket.emit('chat:stop_typing', {
  chatId: '507f1f77bcf86cd799439012'
})

// Message Seen
socket.emit('message:seen', {
  chatId: '507f1f77bcf86cd799439012',
  messageId: '507f1f77bcf86cd799439013'
})
```

### Server → Client Events

```javascript
// Receive Message
socket.on('message:new', (message) => {
  // message = { _id, chatId, senderId, text, ... }
})

// Message Updated
socket.on('message:updated', (message) => {
  // message = { _id, text, isEdited, ... }
})

// Message Deleted
socket.on('message:deleted', ({ messageId, scope }) => {
  // scope = 'me' | 'everyone'
})

// User Typing
socket.on('chat:typing', ({ senderId, chatId }) => {
  // Show "User is typing..."
})

// User Stopped Typing
socket.on('chat:stop_typing', ({ senderId, chatId }) => {
  // Hide typing indicator
})

// Message Seen
socket.on('message:seen', ({ messageId, userId, seenAt }) => {
  // Update message seen status
})

// Presence Update
socket.on('presence:update', ({
  userId,
  isOnline,
  lastSeen
}) => {
  // Update user status
})

// Error
socket.on('error', (error) => {
  console.error('Socket error:', error)
})
```

## Error Responses

All errors follow this format:

```javascript
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { /* additional context */ }
}
```

### Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `UNAUTHORIZED` | 401 | No/invalid token |
| `FORBIDDEN` | 403 | No permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `DUPLICATE_EMAIL` | 409 | Email already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

- General: 100 requests/15 minutes per IP
- Auth: 5 requests/15 minutes per IP
- File Upload: 50 requests/1 hour per user

## Authentication Flow

```
1. User registers/logs in
   ├─ POST /api/auth/register or /api/auth/login
   ├─ Response includes accessToken (15m) + refreshToken (30d)
   └─ Frontend stores both tokens

2. API requests
   ├─ Include `Authorization: Bearer {accessToken}` header
   ├─ Middleware validates JWT signature
   └─ Request proceeds if valid

3. Token expiration
   ├─ When accessToken expires → 401 response
   ├─ Frontend automatically requests new token
   └─ POST /api/auth/refresh with refreshToken
   └─ Get new accessToken

4. Socket.IO connection
   ├─ Connected with `Authorization` header
   ├─ Server validates token
   └─ Socket authenticated user ID attached to connection
```

## Performance Optimization

### Database Indexes
```javascript
// User lookups
db.users.createIndex({ email: 1 })
db.users.createIndex({ name: "text" })

// Message queries
db.messages.createIndex({ chatId: 1, createdAt: -1 })
db.messages.createIndex({ senderId: 1, createdAt: -1 })

// Chat lookups
db.chats.createIndex({ participants: 1 })
```

### Redis Caching
- Store online status
- Cache user profiles
- Session store
- Socket.IO adapter for multi-instance deployment

## Security

- **Password**: Bcrypt with salt rounds 10
- **JWT**: HS256, configurable TTL
- **CORS**: Whitelist specific origins
- **Helmet**: Security headers (CSP, X-Frame-Options, etc.)
- **Rate Limiting**: Express Rate Limit
- **Input Validation**: Zod schemas
- **HTTPS**: Enforce in production

---

**API Version**: 1.0.0
**Last Updated**: April 2024
