const { GoogleGenerativeAI } = require("@google/generative-ai");
const { questionAnswerPrompt , conceptExplainPrompt } = require("../utils/prompts");

const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });


const generateInterviewQuestions = async (req, res) => {
    try{
        const { role, experience, topicsToFocus, numberofQuestions } = req.body;
        if(!role || !experience || !topicsToFocus || !numberofQuestions) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberofQuestions);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        })

        let rawText = response.text;

        // Clean it:
        const cleanedText = rawText
            .replace(/^\d+\.\s+/gm, '') // Remove numbered list prefixes
            .replace(/\n{2,}/g, '\n') // Remove extra newlines
            .trim(); // Trim leading/trailing whitespace

        // Now safe to parse
        const data = JSON.parse(cleanedText);
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: 'Failed to generate questions', error: error.message });
    }
};

const generateConceptExplanation = async (req, res) => {
    try{
        const { question } = req.body;

        if(!question) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const prompt = conceptExplainPrompt(question);
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });

        let rawText = response.text;

        // clean it
        const cleanedText = rawText
            .replace(/^\d+\.\s+/gm, '') // Remove numbered list prefixes
            .replace(/\n{2,}/g, '\n') // Remove extra newlines
            .trim(); // Trim leading/trailing whitespace

        // Now safe to parse
        const data = JSON.parse(cleanedText);
        res.status(200).json(data);
    } catch(error){
        res.status(500).json({ message: 'Failed to generate questions', error: error.message });
    }
};

module.exports = {
    generateInterviewQuestions,
    generateConceptExplanation
};
