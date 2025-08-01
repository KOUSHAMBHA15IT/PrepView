const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) =>(`
    You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Generate ${numberOfQuestions} interview questions.
- For each question, provide a concise yet descriptive answer that is easy to understand, especially for beginners.
- If the answer requires a code example, include a small, clear code block. Keep it relevant and to the point.
- Ensure the formatting is clean and easy to read.
- Return a pure JSON array in the following format:

[
    {
        "question": "Question here?",
        "answer": "Concise and descriptive answer here."
    },
    ...
]

Important: Do NOT add any extra text. Only return valid JSON.
`);


const conceptExplainPrompt = (question) =>(`
    You are an AI trained to generate clear and concise explanations for interview questions.

Task:
- Provide a detailed explanation of the following interview question and its underlying concept, tailored for beginner developers.
- Question: "${question}"
- Explain the concept clearly and concisely, avoiding unnecessary jargon, and ensure the explanation is easy to follow.
- If a code example is necessary, include a small, simple code block.
- After the explanation, include a brief, clear title that summarizes the concept for an article or page header.
- Keep formatting clean, readable, and focused on clarity.
- Don't give any illustrations or tables
- Return the result as a valid JSON object in the following format:

{
    "title": "Concise title summarizing the concept",
    "explanation": "Concise and clear explanation here."
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`);


export { questionAnswerPrompt, conceptExplainPrompt };