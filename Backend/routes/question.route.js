import express from 'express';
import {  togglePinQuestion, updateQuestionNote, addQuestionsToSession } from '../controllers/question.controller.js';
import { protect } from '../middleware/auth.middleware.js'; 

const router = express.Router();

router.post('/add', protect, addQuestionsToSession);
router.post('/:id/pin', protect, togglePinQuestion);
router.post('/:id/note', protect, updateQuestionNote);

export default router;