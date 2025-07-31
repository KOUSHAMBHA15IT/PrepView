import { User } from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
}

//Register a new user
const register = async (req,res) => {
    try {
        
        const {name, email, password, profileImageUrl} = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            profileImageUrl
        })

        const createdUser = await User.findById(newUser._id).select('-password');
        if(!createdUser) {
            return res.status(500).json({ message: 'User creation failed' });
        }

        return res
            .status(201)
            .json({
                user: createdUser,
                message: 'User registered successfully',
                token: generateToken(newUser._id)
            });

    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//Login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.isPasswordMatch(password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const loggedInUser = await User.findById(user._id).select('-password');
        if(!loggedInUser) {
            return res.status(500).json({ message: 'Login failed' });
        }

        return res
            .status(201)
            .json({
                user: loggedInUser,
                message: 'Login successful',
                token: generateToken(user._id)
            });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}

//Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req?.user._id;
        if(!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }
        const user = await User.findById(userId).select('-password');
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            user,
            message: 'User profile retrieved successfully'
        });

    } catch (error) {
        console.error('Get User Profile Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}

export { register, login, getUserProfile };