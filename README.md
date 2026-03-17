# 🌐 Local Skill Exchange Platform

A premium, full-stack peer-to-peer web application where users exchange skills instead of money. Built with the MERN stack and real-time WebSockets.

## 🚀 Features

- **Skill Matching Algorithm**: Scored suggestions based on what you teach vs. what you want to learn.
- **Real-Time Chat**: Instant messaging using Socket.io and room-based synchronization.
- **Exchange Requests**: Formal proposal system (Propose → Accept/Reject → Chat).
- **Profile Management**: Customizable bio, skills inventory, and image uploads.
- **Ratings & Reviews**: Build community trust with feedback after exchanges.
- **Accessible Design**: WCAG 2.1 AA compliant UI with a modern dark-navy aesthetic.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Socket.io-client, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, Multer.
- **Deployment**: Configured for Vercel (Frontend) and Render (Backend).

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local instance

### Step 1: Clone and Install
```bash
# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### Step 2: Environment Setup
1. Create `.env` in the `backend` folder (use `.env.example` as a template).
2. Create `.env` in the `frontend` folder (use `.env.example` as a template).

### Step 3: Run Locally
```bash
# Start Backend (Term 1)
cd backend
npm run dev

# Start Frontend (Term 2)
cd frontend
npm run dev
```

## 📄 License
ISC
