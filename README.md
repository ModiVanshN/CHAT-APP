### 💬 Live Chat App

A full-stack real-time chat application featuring private messaging, emoji support, file sharing, authentication, and email notifications. Built with **React (Vite)** on the frontend and **Node.js, Express, and MongoDB** on the backend, using **Socket.io** for real-time communication.

---
![image](https://github.com/user-attachments/assets/ae962f07-4b0c-4a70-94d9-c67c41a35bb0)
## ⚙️ Tech Stack

### 🔧 Backend
- **Node.js + Express** – API & server
- **MongoDB + Mongoose** – Database
- **Socket.io** – Real-time WebSocket communication
- **JWT + bcrypt** – Authentication & security
- **Multer** – File uploads
- **Nodemailer** – Email notifications
- **Other tools:** dotenv, cors, cookie-parser, express-validator, crypto-js, axios

### 🎨 Frontend
- **React + Vite** – Frontend framework
- **React Router DOM** – Client-side routing
- **Socket.io-client** – WebSocket integration
- **Tailwind CSS + DaisyUI** – Responsive UI styling
- **React Toastify** – Notifications
- **Emoji Picker, React Icons, Infinite Scroll** – Enhanced UX

---

## 📁 Project Structure

```
live-chat-app/
├── backend/
│   ├── controller/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── contexts/
        ├── pages/
        ├── routes/
        ├── App.jsx
        └── main.jsx
```

---
![Live‑Chat UI](![image](https://github.com/user-attachments/assets/030000ee-0a51-4dfe-b041-a144574a8b19)
)

## 🚀 Getting Started

### 📌 Backend Setup

```bash
cd backend
npm install
```

1. Create a `.env` file in `backend/` and configure:
   ```env
   PORT=5000
   MONGODB_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

2. Start the backend server:
   ```bash
   npm start
   ```

> Runs with `nodemon` and listens for API and WebSocket connections.

---

### 🌐 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> The frontend runs on Vite's development server with hot reloading (usually at `http://localhost:5173`).

---

## 📝 Notes

- Start the **backend** before the **frontend** for proper API and socket functionality.
- Adjust environment variables based on your deployment or local setup.
- Tailwind and DaisyUI are fully customizable via `tailwind.config.js`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Fork this repo
- Create a feature branch
- Submit a pull request

For major changes, please open an issue to propose the change.

---

## 📜 License

Licensed under the **ISC License**.
