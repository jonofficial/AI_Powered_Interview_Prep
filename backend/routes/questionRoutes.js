const express = require("express");
const {
  togglePinQuestion,
  updateQuestion,
  addQuestionsToSession
} = require("../controllers/questionController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/toggle-pin/:id', protect, togglePinQuestion);  
router.put('/update-note/:id', protect, updateQuestion);
router.post('/add-to-session', protect, addQuestionsToSession);

module.exports = router;
