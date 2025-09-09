const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const sequelize = require("./config/db");
const jwt = require("jsonwebtoken");

dotenv.config();

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");


const app = express();
app.use(cors({ origin: process.env.WEB_SITE_APP_URL, credentials: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.WEB_SITE_APP_URL, methods: ["GET", "POST"] },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

let onlineUsers = {};


io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Pas de token fourni"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Token invalide ou expiré"));
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Utilisateur connecté :", socket.user);

  socket.on("user:join", (user) => {
    onlineUsers[socket.id] = { ...user, id: socket.user.id };
    io.emit("users:update", Object.values(onlineUsers));
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("users:update", Object.values(onlineUsers));
    console.log("❌ Utilisateur déconnecté :", socket.user);
  });
});

sequelize.sync().then(() => {
  server.listen(3001, () => {
    console.log(`🚀 Serveur en ligne sur ${process.env.SERVER_URL}`);
  });
});
