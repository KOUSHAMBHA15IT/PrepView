import { GoogleGenAI } from "@google/genai";
import { conceptExplainPrompt, questionAnswerPrompt } from "../utils/prompts.util.js";
import { configDotenv } from "dotenv";
configDotenv({quiet: true});

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENAI_API_KEY});

const generateInterviewQuestions = async (req, res) => {
    try {
        
        const {role, experience, topicsToFocus, numberOfQuestions} = req.body;
        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash-8b",
            contents: prompt
        })

        let rawText = response.text;

        // Remove all types of code block markers (```json, ```javascript, ```)
        const cleanedText = rawText
            .replace(/```(?:json|javascript)?\s*/g, '')  // Remove opening code block (with optional language)
            .replace(/```(\s*)$/g, '')                   // Remove closing code block at the end (with optional whitespace)
            .trim();                                    // Remove leading and trailing whitespace

        const data = JSON.parse(cleanedText);
        return res.status(200).json(data);

    } catch (error) {
        console.log("Error generating interview questions:", error);
        return res.status(500).json({ error: "Failed to generate interview questions" });
    }
}

const generateConceptExplanation = async (req, res) => {
    try {
        const {question} = req.body;
        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        const prompt = conceptExplainPrompt(question);
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash-8b",
            contents: prompt
        });
        let rawText = response.text;
        // console.log("Raw response text:", rawText);
        

        // Remove all types of code block markers (```json, ```javascript, ```)
        const cleanedText = rawText
        .replace(/^```(?:json|javascript)?\s*/i, '')  // Remove opening code block with optional language
        .replace(/```(\s*)$/g, '')                   // Remove closing code block at the end, allowing for optional whitespace
        .trim();

        const data = JSON.parse(cleanedText);
        return res.status(200).json(data);

    } catch (error) {
        console.log("Error generating concept explanation:", error);
        return res.status(500).json({ error: "Failed to generate concept explanation" });
    }
}

export { generateInterviewQuestions, generateConceptExplanation };