import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

const protect = async (req, res, next) => {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if(!token) {
        return res.status(401).json({ message: 'Token Not Found' });
    }

    try {
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.id).select('-password');
        if(!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        req.user = user;
        next();

    } catch (error) {
        console.error('Authentication Error:', error);
        return res.status(401).json({ message: 'Invalid Token' });
    }
}

export { protect };