// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// אחסון פשוט להדגמה
let USERS = {};
let POSTS = [];
let MESSAGES = [];
let FILES = {};

app.use(express.json());

// הגדרת multer לאחסון העלאות
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

// לדוגמה
app.get('/', (req, res) => {
  res.send("Little Pro server is running on Railway!");
});

// הרשמה
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

// התחברות
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS[username];
  if (user && user.password === password) {
    return res.json({ success: true, username });
  } else {
    return res.json({ success: false, message: "Invalid username or password" });
  }
});

// פוסטים
app.get('/posts', (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const pageSize = 5;
  const sorted = POSTS.slice().sort((a,b) => b.createdAt - a.createdAt);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pagePosts = sorted.slice(start, end);
  res.json({ posts: pagePosts });
});

app.post('/posts', (req, res) => {
  const { user, content, type, file, filter } = req.body;
  const post = {
    id: Date.now(),
    user,
    createdAt: Date.now()
  };
  if (type === 'text') {
    post.type = 'text';
    post.content = content;
  } else if (type === 'image' || type === 'video') {
    post.type = type;
    post.content = file;
    if (filter) post.filter = filter;
  } else {
    return res.json({ success: false, message: "Invalid post type" });
  }
  POSTS.push(post);
  return res.json({ success: true, post });
});

// העלאת קובץ
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: "No file uploaded" });
  }
  const user = req.body.user;
  const originalName = req.file.originalname;
  const storedName = req.file.filename;
  const fileType = req.file.mimetype;

  const fileInfo = {
    id: Date.now(),
    name: storedName,
    originalName,
    type: fileType,
    date: Date.now()
  };
  if(!FILES[user]) FILES[user] = [];
  FILES[user].push(fileInfo);
  return res.json({ success: true, file: fileInfo });
});

// WebSocket
io.on('connection', socket => {
  console.log('Socket connected:', socket.id);
});

// להאזין לפורט מ-railway או 3000 מקומית
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Little Pro server listening on port ${PORT}`);
});