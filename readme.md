# 🗳️ Live Polling Application with Chat

A real-time polling web application where **teachers** can create time-bound questions, and **students** can answer them live. Includes a built-in **chat feature** for seamless interaction during sessions.

---

## ✨ Features

- 👨‍🏫 **Teacher Panel**
  - Create a poll with a question and multiple options
  - Set a custom time duration for each poll
  - Broadcast polls live to all connected students

- 👩‍🎓 **Student Panel**
  - Join a live poll session
  - View the active question and options
  - Submit your answer before the timer ends

- 💬 **Real-time Chat**
  - Students and teachers can exchange messages
  - Sender's name and alignment displayed clearly

- 📊 **Live Results**
  - View real-time vote count updates
  - See final poll results when time ends

---

## ⚙️ Tech Stack

### Frontend
- **React** + **Vite** – Fast, modern UI
- **Tailwind CSS** – Utility-first styling
- **Socket.IO (Client)** – Real-time communication

### Backend
- **Express.js** – Lightweight REST/Socket server
- **Socket.IO (Server)** – Handles live poll and chat updates

---

## 🚀 Getting Started

### 🔧 Backend Setup

```bash
cd backend
npm install
node index.js

cd frontend
npm install
npm run dev
```
