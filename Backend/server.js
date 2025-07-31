import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from "./config/db.js";
import authRoutes from './routes/auth.route.js';
import { fileURLToPath } from 'url';

configDotenv({quiet: true});

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware to handle CORS and JSON parsing
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the 'uploads' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, 'uploads'), {}));

// Basic route to check server status
app.get('/', (req,res) => {
    res.send('Welcome to the Backend Server!');  
})

//Cannot get /uploads/
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('File not found:', err);
            res.status(404).send('File not found');
        } else {
            console.log('File sent:', filename);
        }
    });
});

//Routes
app.use('/api/auth', authRoutes)
// app.use('/api/sessions', sessionRoutes)
// app.use('/api/questions', questionRoutes)

// app.use('/api/ai/generate-questions',protected, generateInterviewQuestions);
// app.use('/api/ai/generate-explanation', protected, generateConceptExplanation);


//Connect to the database
connectDB()
.then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})
})
.catch((error) => {
    console.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1);
});