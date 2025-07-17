require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares to handle CORS
app.use(
    cors({
        origin: "http://localhost:5173", // Adjust this to your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

connectDB();

// middlewares
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
// app.use("/api/sessions", sessionRoutes);
// app.use("/api/questions", questionRoutes);

// app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
// app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

// server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));