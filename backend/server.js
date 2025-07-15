// Core Imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Local Imports
import connectDB from "./database/db.js";
import userRouter from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import ChatRoutes from "./routes/chat.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Allow both Vercel frontend & localhost for dev
const allowedOrigins = [
  "https://chat-app-red-tau-45.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Same CORS config for Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Static file handling
app.use('/Image', express.static(path.join(path.resolve(), 'public', 'Image')));
app.use('/media', express.static(path.join(path.resolve(), 'public', 'media')));

// ✅ Basic test route
app.get("/", (req, res) => {
  res.send("Hello Chatt!");
});

// ✅ API Routes
app.use("/api/ChatApp/user", userRouter);
app.use("/api/ChatApp/message", messageRoutes);
app.use("/api/ChatApp/Chat", ChatRoutes);

// ✅ DB connection
connectDB();
mongoose.connect(process.env.DATABASE_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ Socket.io event handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(`${userData.name} joined personal room`);
  });

  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log(`User joined chat room: ${roomId}`);
  });

  socket.on("new message", (msg) => {
    const chat = msg.chat;
    if (!chat.members) return;

    chat.members.forEach((member) => {
      if (member._id !== msg.Sender._id) {
        socket.to(member._id).emit("message received", msg);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
