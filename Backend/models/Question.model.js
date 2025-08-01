import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
    },
    question: {
        type: String,
    },
    answer: {
        type: String,
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    note: {
        type: String,
        default: '',
    }
}, {timestamps: true});

export const Question = new mongoose.model('Question', questionSchema);