import express from 'express';
import { register, login, getUserProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

//Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);

router.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
})

export default router;