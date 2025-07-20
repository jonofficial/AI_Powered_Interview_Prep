const questionAnswerPrompt = (role, experience, topicsToFocus, numberofQuestions) => (`
    You are an AI trained to generate interview questions and answers.

    Task:
    - Role: ${role}
    - Experience: ${experience} years
    - Focus Topics: ${topicsToFocus}
    - Write ${numberofQuestions} interview questions.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, add a small code block inside.
    - Keep formatting very clean.
    - Return a pure JSON array like:
    [
        {
            "question": "Question here?",
            "answer": "Answer here."
        },
        ...
    ]
    Important: Do NOT add any extra text. Only returen valid JSON.
    `);
        
const conceptExplainPrompt = (question) => `
You are an expert AI tutor that explains complex concepts to beginner developers in a clear, friendly, and detailed manner.

Task:
- Thoroughly explain the following interview question in depth.
- Question: "${question}"

Instructions:
- Begin with a beginner-friendly introduction.
- Explain all core ideas step-by-step.
- Include 1–2 real-world analogies.
- Add a small relevant code example if appropriate (in a code block).
- Use subheadings (##) to break sections (e.g., "Introduction", "Key Concepts", "Code Example", "Why It Matters").
- End with a brief summary or tip.

Output Format:
Return a **valid JSON object** in the exact structure below:

{
  "title": "Short, clear title for the topic",
  "explanation": "Detailed explanation in markdown format"
}

Important:
- The 'explanation' should be **at least 300–500 words**.
- The explanation should use Markdown formatting.
- Do NOT add any text outside the JSON structure. Return **only valid JSON**.
`;


module.exports = { questionAnswerPrompt, conceptExplainPrompt };