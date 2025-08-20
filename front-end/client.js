function parseJwt(token) {
  const base64Url = token.split('.')[1];
  return JSON.parse(atob(base64Url));
}

let socket;
let currentUserName;

// --- Connect to socket ---
function connectSocket(token) {
  const user = parseJwt(token); // decode token to get name
  currentUserName = user.name;

  socket = io("http://localhost:4000", { auth: { token } });

  socket.on('connect', () => {
    console.log("Connected User:", user.name);
  });

  // Receive chat messages
  socket.on('chatMessage', (msg) => {
    const messageList = document.getElementById('messages');
    const li = document.createElement('li');

    if(msg.client === currentUserName) {
      li.style.fontWeight = 'bold';
      li.style.color = 'blue';
      li.textContent = "You: " + msg.message;
    } else {
      li.textContent = msg.client + ": " + msg.message;
    }

    messageList.appendChild(li);
    messageList.scrollTop = messageList.scrollHeight;
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('connect_error', (err) => {
    console.log('Connection error:', err.message);
    if(err.message === 'TokenExpired') {
      alert('Session expired, login again');
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    }
  });
}

// --- Send chat message ---
function sendMessage() {
  const input = document.getElementById('chatinput');
  const message = input.value.trim();
  if(message && socket) {
    socket.emit('chatMessage', { message, client: currentUserName });
    input.value = '';
  }
}

// --- Setup chat events ---
function setupChat() {
  const input = document.getElementById('chatinput');
  const btn = document.getElementById('send');

  btn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendMessage();
  });
}

// --- Auto-connect if token exists ---
const savedToken = localStorage.getItem('token');
if(savedToken) {
  connectSocket(savedToken);
  setupChat();
}

// --- Login ---
function login() {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('http://localhost:4000/user/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if(data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.name);
        window.location.href = "index.html";
      } else {
        alert('Invalid login');
      }
    } catch(err) {
      console.error("Login Error:", err);
    }
  });
}

login();