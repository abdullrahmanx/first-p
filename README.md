# YLabena Project

## Overview
This project is a Node.js & Express-based API for managing drinks and users, with real-time communication using Socket.IO. It includes user authentication, role-based access, and CRUD operations for drinks.

---

## Features

### Users API
- User registration (Sign Up)
- User login with JWT token authentication
- Profile management (view & edit profile)
- Change password
- Forgot & reset password
- Profile image upload
- Role-based authorization for specific routes

### Drinks API
- Get all drinks
- Get a specific drink by ID
- Add a new drink (real-time notification)
- Edit a drink (real-time notification)
- Delete a drink (real-time notification)

### Real-time Communication
- Chat messages between connected users
- Messages display the sender’s name
- Auto-scroll chat to newest message
- Highlight own messages
- Token-based connection for authentication

---

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs for password hashing
- Joi validation
- Socket.IO for real-time communication
- Multer for file uploads

---

## Folder Structure
project/
│
├─ MongoModel/ # Mongoose models for users & drinks
├─ Routes/ # API route handlers
├─ Controllers/ # Controllers for API logic
├─ utils/ # Error classes, middleware, etc.
├─ uploads/ # Uploaded files (images)
├─ client.js # Front-end JS for chat
├─ index.html # Simple chat client
├─ package.json
├─ .env # Environment variables
└─ README.md


---

## Setup

 Clone the repository:
```bash
git clone <your-repo-url>
cd <your-project-folder>
npm install

 Create a .env file with your environment variables:
PORT=3000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>


 Run the project:
node oy.js

 Open index.html in browser to test chat.

Notes

node_modules/, .env, and uploads/ are ignored in Git (.gitignore).

Make sure your MongoDB is running.

Real-time chat works only if multiple users are connected.



