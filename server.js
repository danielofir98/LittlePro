// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const multer = require('multer');

const app = express();
const server = http.createServer(app);  // <-- הגדרת השרת
const io = socketIo(server);           // <-- WebSocket (Socket.IO) המבוסס על אותו שרת

// אחסון פשוט להדגמה (כמו שהראית בקוד שלך)
let USERS = {};
let POSTS = [];
let MESSAGES = [];
let FILES = {};

// שימוש ב-JSON parser
app.use(express.json());

// הגדרת multer לאחסון העלאות קבצים (אם זה קיים בקוד שלך)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueName = baseName + '-' + Date.now() + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// דוגמה לנתיב בסיסי
app.get('/', (req, res) => {
  res.send("Little Pro server is running on Railway!");
});

// דוגמה לרישום
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: "Missing credentials" });
  }
  if (USERS[username]) {
    return res.json({ success: false, message: "Username already exists" });
  }
  USERS[username] = { username, password };
  console.log(`User registered: ${username}`);
  return res.json({ success: true, username });
});

// דוגמה להתחברות
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS[username];
  if (user && user.password === password) {
    return res.json({ success: true, username });
  } else {
    return res.json({ success: false, message: "Invalid username or password" });
  }
});

// WebSocket – מאזין לחיבורים
io.on('connection', socket => {
  console.log('Socket connected:', socket.id);
});

// מאזינים לפורט שהסביבה מספקת, או 3000 מקומית
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Little Pro server listening on port ${PORT}`);
});
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
console.log("After server.listen() – no crash yet...");