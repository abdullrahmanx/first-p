# Chat & Drinks Management App

A Node.js application with JWT-authenticated users, drinks management, and real-time chat using Socket.io.

---

## Features

### Users
- Signup and login with JWT authentication
- Edit profile, change password, upload profile image
- Password reset via token
- Role-based access control (admin/user)
- Input validation with Joi
- Global error handling

### Drinks
- Add, edit, delete drinks (admin only)
- View all drinks or a specific drink
- Real-time updates via Socket.io
- Input validation with Joi
- Global error handling

### Real-time Chat
- Authenticated users can chat in real-time
- Messages display sender's name correctly
- Auto-scroll to newest messages
- Highlight own messages
- Token-based Socket.io connection
- Session expiration handling

---

## Tech Stack
- Node.js, Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Socket.io for real-time communication
- Joi for request validation
- Multer for file uploads

---

## Installation

1. Clone the repo:
```bash
git clone https://github.com/abdullrahmanx/first-p.git
cd first-p
