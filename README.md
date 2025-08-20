 First Project

A Node.js application with JWT-authenticated users, drinks management, and SIMPLE real-time chat using Socket.io.
=======


## Overview
This project is a Node.js & Express-based API for managing drinks and users, with real-time communication using Socket.IO. It includes user authentication, role-based access, and CRUD operations for drinks.
>>>>>>> f852ef9 (Add README.md)

---

## Features

<<<<<<< HEAD
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
=======
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
>>>>>>> f852ef9 (Add README.md)

---

## Tech Stack
<<<<<<< HEAD
- Node.js, Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Socket.io for real-time communication
- Joi for request validation
=======
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs for password hashing
- Joi validation
- Socket.IO for real-time communication
>>>>>>> f852ef9 (Add README.md)
- Multer for file uploads

---

<<<<<<< HEAD
## Installation

1. Clone the repo:
```bash
git clone https://github.com/abdullrahmanx/first-p.git
cd first-p
=======
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

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-project-folder>
npm install

3- Create a .env file with your environment variables:
PORT=3000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>


4- Run the project:
node oy.js

-5 Open index.html in browser to test chat.

Notes

node_modules/, .env, and uploads/ are ignored in Git (.gitignore).

Make sure your MongoDB is running.

Real-time chat works only if multiple users are connected.



>>>>>>> f852ef9 (Add README.md)
