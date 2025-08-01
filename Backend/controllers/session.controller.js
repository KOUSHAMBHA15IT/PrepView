import {Session} from '../models/session.model.js';
import {Question} from '../models/question.model.js';

const createSession = async (req, res) => {
    try {
        
        const { role, experience, topicsToFocus, description, questions} = req.body;
        if(!role || !experience || !topicsToFocus) {
            return res.status(400).json({ message: 'Role, experience, and topics to focus are required.' });
        }

        const userId = req?.user._id

        const createdSession = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        })

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: createdSession._id,
                    question: q.question,
                    answer: q.answer,
                })
                return question._id;
            })
        )

        createdSession.questions = questionDocs;
        await createdSession.save();

        return res.status(201).json({ success: true, message: 'Session created successfully', session: createdSession });

    } catch (error) {
        console.log('Error creating session:', error);
        return res.status(500).json({ success: false ,message: 'Internal server error' });
    }
}

const getMySessions = async (req, res) => {
    try {
        
        const sessions = await Session.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('questions');
        return res.status(200).json({ success: true, sessions });

    } catch (error) {
        console.log('Error fetching my sessions:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getSessionById = async (req, res) => {
    try {
        
        const session = await Session.findById(req.params.id)
            .populate({
                path: 'questions',
                options: {sort: { isPinned: -1, createdAt: 1 } }
            })
            .exec()

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        return res.status(200).json({ success: true, session });

    } catch (error) {
        console.log('Error fetching session by ID:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        if(session.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this session' });
        }

        await Question.deleteMany({ session: session._id });
        await Session.deleteOne({ _id: session._id });
        
        return res.status(200).json({ success: true, message: 'Session deleted successfully' });

    } catch (error) {
        console.log('Error deleting session:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export { createSession, getMySessions, getSessionById, deleteSession };