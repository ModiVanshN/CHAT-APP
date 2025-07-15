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

// ✅ CORS Config
const allowedOrigins = [
  "https://chat-app-red-tau-45.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Static Assets
app.use('/Image', express.static(path.join(path.resolve(), 'public', 'Image')));
app.use('/media', express.static(path.join(path.resolve(), 'public', 'media')));

// ✅ Test Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from Chat Backend" });
});

// ✅ Routes
app.use("/api/ChatApp/user", userRouter);
app.use("/api/ChatApp/message", messageRoutes);
app.use("/api/ChatApp/Chat", ChatRoutes);

// ✅ Connect DB
connectDB();
mongoose.connect(process.env.DATABASE_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error", err));

// ✅ Socket.io Handling
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

// ✅ Start Server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
