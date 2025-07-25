require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();

// Middlewares to handle CORS
// app.use(
//     cors({
//         origin: "http://localhost:5173", // Adjust this to your frontend URL
//         methods: ["GET", "POST", "PUT", "DELETE"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//     })
// );
app.use(cors());

connectDB();

// middlewares
app.use(express.json());

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:`Server is running on port ${PORT}`
    })
})

// routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

// server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
