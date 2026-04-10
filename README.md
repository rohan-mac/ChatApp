# ChatApp

A production-ready WhatsApp-style real-time chat application built with React, Vite, Node.js, Express, MongoDB, Socket.IO, JWT authentication, and Cloudinary media uploads.

## Features

- JWT signup and login with bcrypt password hashing
- Protected API routes and Socket.IO auth
- One-to-one real-time chat with message delivery and seen states
- Typing indicators, online presence, and unread counts
- Message editing, delete-for-me, delete-for-everyone, and starring
- Media support for images, videos, and documents through Cloudinary
- Chat archive support, user search, and message search
- Responsive multi-page UI:
  - Login/Register
  - Chat Dashboard
  - Profile
  - Settings
- Admin dashboard routes for users, chats, reports, and settings

## Folder Structure

```text
ChatApp/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      socket/
      validators/
    tests/
    .env.example
  frontend/
    src/
      api/
      components/
      context/
      hooks/
      layouts/
      pages/
      router/
    .env.example
```

## Environment Setup

### Backend Environment Files

**`backend/.env`** - Your actual backend environment variables (DO NOT commit)
**`backend/.env.example`** - Template showing required variables

Copy `backend/.env.example` to `backend/.env` and fill in your values.

### Frontend Environment Files

**`frontend/.env`** - Your actual frontend environment variables (DO NOT commit)
**`frontend/.env.example`** - Template showing required variables

Copy `frontend/.env.example` to `frontend/.env` and configure for your environment.

### Quick Setup

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI, JWT secrets, etc.

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your API URLs
```

### Deployment

**Render (Backend):** Copy values from `backend/.env` to Render environment variables

**Vercel (Frontend):** Copy `VITE_*` values from `frontend/.env` to Vercel environment variables

## Install

```bash
npm run install:all
```

Or install separately:

```bash
npm install --prefix backend
npm install --prefix frontend
```

## Run Locally

Backend:

```bash
npm run dev:backend
```

Frontend:

```bash
npm run dev:frontend
```

Open `http://localhost:5173`.

## Build

Frontend production build:

```bash
npm run build:frontend
```

Backend start:

```bash
npm start --prefix backend
```

## Testing

Backend tests:

```bash
npm test --prefix backend
```

Recommended manual checks:

1. Register two users and open two browser sessions.
2. Verify text messages render visibly in both sessions.
3. Verify Socket.IO delivery, typing, and seen states.
4. Upload image/video attachments and confirm Cloudinary URLs are returned.
5. Edit, star, and delete messages.
6. Archive a chat and verify it disappears from the active list.

## Deployment

### Frontend

- Vercel or Netlify
- Set `VITE_API_URL` and `VITE_SOCKET_URL` to the deployed backend URL

### Backend

- Render or Railway
- Set all backend environment variables
- Ensure MongoDB Atlas and Cloudinary credentials are present

### Database

- MongoDB Atlas
- Use the provided `MONGO_URI` in `backend/.env`

## Notes

- The message visibility bug was fixed by aligning frontend rendering with the backend payload shape:
  - render `message.text`
  - render `message.mediaUrl` and `messageType`
  - dedupe socket/API message inserts
  - keep bubble text colors distinct from the background
