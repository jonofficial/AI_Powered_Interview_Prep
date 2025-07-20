/* -------------------------- OpenAI initialisation ------------------------- */
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  /* ‼️ If you're behind proxy / need org: add here
     organization: process.env.OPENAI_ORG_ID,
  */
});

/* ------------------------------ Prompts ----------------------------------- */
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require('../utils/prompts');

/* -------------------------------------------------------------------------- */
/*                             Helper – ask GPT                              */
/* -------------------------------------------------------------------------- */
async function chatCompletion(systemPrompt, userPrompt) {
  const chat = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt   },
    ],
  });

  /* openai.chat.completions.create → { choices: [ { message: { content } } ] } */
  return chat.choices[0].message.content;
}

/* -------------------------------------------------------------------------- */
/*                     Generate Interview Questions API                       */
/* -------------------------------------------------------------------------- */
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberofQuestions } = req.body;
    if (!role || !experience || !topicsToFocus || !numberofQuestions) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    /* ❶ Build a single prompt string with your existing helper: */
    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberofQuestions,
    );

    /* ❷ Ask GPT‑3.5 */
    const raw = await chatCompletion(
      'You are an interview‑question generator that returns valid JSON.',
      prompt,
    );

    /* ❸ Clean / parse (if your prompt already enforces strict JSON, skip cleaning) */
    const cleaned = raw.trim();
    const data = JSON.parse(cleaned);

    return res.status(200).json({ questions: data });
  } catch (error) {
    console.error('Error in generateInterviewQuestions:', error);
    return res
      .status(500)
      .json({ message: 'Failed to generate questions', error: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                      Generate Concept Explanation API                      */
/* -------------------------------------------------------------------------- */
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const prompt = conceptExplainPrompt(question);

    const raw = await chatCompletion(
      'You are a helpful tutor that returns concise JSON answers.',
      prompt,
    );

    const cleaned = raw.trim();
    const data = JSON.parse(cleaned);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in generateConceptExplanation:', error);
    return res
      .status(500)
      .json({ message: 'Failed to generate explanation', error: error.message });
  }
};

/* -------------------------------------------------------------------------- */
module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
