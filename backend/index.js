import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(json());

// --- Database Connection ---
// V-- ADDED THIS LINE FOR DEBUGGING --V
console.log('Attempting to connect with URI:', process.env.MONGO_URI);

connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error(err));

// --- API Routes ---
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRouter);


// --- Start The Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

