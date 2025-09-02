# First Project

A Node.js & Express API with JWT-authenticated users and drinks management

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
- Input validation with Joi
- Global error handling

## API Documentation

You can view and test all API endpoints using Postman:

[Postman Documentation] (https://documenter.getpostman.com/view/47108996/2sB3BKFojg)

## Tech Stack
- Node.js, Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs for password hashing
- Joi validation
- Multer for file uploads

## Folder Structure

project/

├─ MongoModel/ # Mongoose models for users & drinks

├─ Routes/ # API route handlers

├─ Controllers/ # Controllers for API logic

├─ utils/ # Error classes, middleware, etc.

├─ uploads/ # Uploaded files (ignored in Git)

├─ client.js # Front-end JS for chat

├─ index.html # Simple chat client

├─ package.json

├─ .env # Environment variables

└─ README.md



## Setup

1. Clone the repository:
```bash

git clone https://github.com/abdullrahmanx/first-p.git
cd first-p
npm install

2. Create a .env file with your environment variables:

   PORT=3000
   MONGO_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
3. Run the project:

    node oy.js

Notes: 

node_modules/, .env, and uploads/ are ignored in Git (.gitignore).

Make sure your MongoDB is running.





