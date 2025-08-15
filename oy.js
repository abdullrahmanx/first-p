// server.js

// ------------------- Imports -------------------
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const routes = require('./Routes/drinkRoutes');
const userRoutes = require('./Routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');
const User = require('./MongoModel/userModel');

// ------------------- MongoDB Connection -------------------
mongoose.connect(process.env.URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ------------------- Middleware -------------------
app.use(cors()); // allow all origins for dev; change for production
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
});

// ------------------- Routes -------------------
app.use('/drinks', routes);
app.use('/user', userRoutes);

// Global error handler
app.use(errorHandler);

// ------------------- HTTP + Socket.io -------------------
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

// ------------------- Socket.io Auth -------------------
io.on("connection", (socket) => {
  // --- 1️⃣ Get token from client auth ---
  const token = socket.handshake.auth.token;
  let userName = "Anonymous";

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userName = decoded.name;
  } catch (err) {
    console.log("Socket auth error:", err.message);
  }

  console.log("Client Connected:", socket.id, "-", userName);

  // --- 2️⃣ Receive chat messages ---
  socket.on("chatMessage", (msg) => {
    // msg.client is already sent from client, but we can overwrite to be safe
    io.emit("chatMessage", { client: userName, message: msg.message });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

//------------------ Start Server -------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
