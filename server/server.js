import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import ImageRouter from './routes/imageRoutes.js';

// The app instance should be defined before connection logic for Vercel
const app = express();

// Await the database connection
await connectDB()


// 1. JSON body parser (for your prompt data)
app.use(express.json());

// 2. URL-encoded body parser (for form data)
app.use(express.urlencoded({ extended: true }))

// 3. CRITICAL CORS FIX: Explicitly allow the frontend origin
// This addresses the 'No Access-Control-Allow-Origin header' error.
app.use(cors());


app.use('/api/user', userRouter)
app.use('/api/image', ImageRouter)

app.get('/', (req, res) => {
    res.send("API Working Mahi")
})

// CRITICAL VERCELL FIX: Remove app.listen() for serverless deployment
// and export the app instance.
const PORT = process.env.PORT || 4000; // REMOVED
app.listen(PORT, () => { // REMOVED
    console.log("APP IS LISTENINIG AT PORT: " + PORT) // REMOVED
}) // REMOVED

export default app; 
