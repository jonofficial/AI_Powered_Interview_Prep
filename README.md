# 🧠 AI-Powered Interview Prep

A smart and modern web application that helps you prepare for tech interviews with role-specific, AI-generated questions and answers. Dive deep into concepts, generate beginner-friendly explanations, and organize your sessions — all within a beautifully responsive interface powered by OpenAI.

---

## ✨ Features

- 🎯 Create interview sessions based on role, experience, and topics
- 🤖 Generate high-quality Q&A pairs with OpenAI (GPT-3.5)
- 📚 Dive deeper into any question with detailed concept explanations
- 📌 Pin important questions and manage your sessions with ease
- 🧵 Clean and responsive UI using Tailwind CSS
- 🔐 Secure user authentication and session management

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite  
- **Styling**: Tailwind CSS  
- **Animations**: Framer Motion  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB + Mongoose  
- **Auth**: JWT-based authentication  
- **AI Integration**: OpenAI API (GPT-3.5)

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js ≥ 16.x  
- MongoDB Atlas or Local MongoDB instance  
- OpenAI API Key → [Get it here](https://platform.openai.com/account/api-keys)

---

### 📁 Clone & Setup

```bash
git clone https://github.com/yourusername/ai-interview-prep.git
cd ai-interview-prep
npm install
```

## 🔐 Environment Variables

Create a .env file in both frontend/ and backend/ directories.

For /backend/.env:

```bash
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```

For /frontend/.env:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

## 💻 Run Locally

Start Backend:

```bash
cd backend
npm install
npm run dev
```

Start Frontend:

```bash
cd frontend
cd vite-project
npm install
npm run dev
```
Then open your browser and go to: http://localhost:5173

## 🧪 Postman API Testing

You can test APIs like:

```bash
POST /api/sessions – Create a new session
DELETE /api/sessions/:id – Delete session (pass JWT token in headers)
POST /api/ai/generate-questions – Get Q&A using OpenAI
POST /api/ai/concept-explanation – Get detailed concept explanation
```

Include the Authorization header in the format:

```bash
Authorization: Bearer <your-jwt-token>
```

## 📄 License

This project is licensed under the [MIT License](LICENSE)
