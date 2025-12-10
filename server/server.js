import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import ImageRouter from './routes/imageRoutes.js';


// [CRITICAL FIX 3: TOP-LEVEL AWAIT] The database connection should happen here for cold start, and 
// is idempotent thanks to the update in config/mongodb.js.
await connectDB()

// const PORT = process.env.PORT || 4000; // Removed as it's not needed for Vercel export
const app = express();

// --- Move body parsers to the top ---

// 1. JSON body parser (for your prompt data)
app.use(express.json());

// 2. URL-encoded body parser (for form data)
app.use(express.urlencoded({extended:true}))

// [CRITICAL FIX 2: CORS] Explicitly allow your frontend origin to fix CORS preflight errors.
app.use(cors({
    origin: 'https://imagify-ai-six.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    credentials: true, 
}));


app.use('/api/user' , userRouter) 
app.use('/api/image' , ImageRouter) 

app.get('/' , (req , res)=>{
    res.send("API Working Mahi")
})

// [CRITICAL FIX 1: SERVERLESS] REMOVE app.listen() for Vercel serverless environment
// app.listen(PORT , ()=>{
//     console.log("APP IS LISTENINIG AT PORT: " + PORT)
// })

// [CRITICAL FIX 1: SERVERLESS] EXPORT the app instance for Vercel.
export default app;
