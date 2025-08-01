import { Question } from "../models/question.model.js";
import { Session } from "../models/session.model.js";

const addQuestionsToSession = async (req, res) => {
    try {
        
        const { sessionId, questions } = req.body;

        if (!sessionId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        // Find the session
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Add questions to the session
        const createdQuestions = await Question.insertMany(
            questions.map(q => ({
                session: sessionId,
                question: q.question,
                answer: q.answer,
            }))
        )

        session.questions.push(...createdQuestions.map(q => q._id));
        await session.save();

        return res.status(201).json({ message: "Questions added successfully", createdQuestions });

    } catch (error) {
        console.log("Error adding questions to session:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const togglePinQuestion = async (req, res) => {
    try {
        
        const questionId = req?.params.id;

        const fetchedQuestion = await Question.findById(questionId);
        if (!fetchedQuestion) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }
        // Toggle the pin status
        fetchedQuestion.isPinned = !fetchedQuestion.isPinned;
        const updatedQuestion = await fetchedQuestion.save();

        if (!updatedQuestion) {
            return res.status(404).json({success:false, message: "Question not found" });
        }
        return res.status(200).json({success:true, message: "Question pin status updated", question: updatedQuestion });

    } catch (error) {
        console.log("Error toggling pin status of question:", error);
        return res.status(500).json({ success:false, message: "Internal server error" });
    }
}

const updateQuestionNote = async (req, res) => {
    try {
        
        const {note} = req.body;
        const questionId = req.params.id;

        if (!note || !questionId) {
            return res.status(400).json({ success: false, message: "Note and question ID are required" });
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            questionId,
            { note },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }
        return res.status(200).json({ success: true, message: "Question note updated", question: updatedQuestion });

    } catch (error) {
        console.log("Error updating question note:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { addQuestionsToSession, togglePinQuestion, updateQuestionNote };