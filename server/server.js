import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import ImageRouter from './routes/imageRoutes.js';


const PORT = process.env.PORT || 4000;
const app = express();
await connectDB()

// --- Move body parsers to the top ---

// 1. JSON body parser (for your prompt data)
app.use(express.json());

// 2. URL-encoded body parser (for form data)
app.use(express.urlencoded({extended:true}))

// 3. CORS
app.use(cors());


app.use('/user' , userRouter)
app.use('/image' , ImageRouter)

app.get('/' , (req , res)=>{
    res.send("API Working Mahi")
})

app.listen(PORT , ()=>{
    console.log("APP IS LISTENINIG AT PORT: " + PORT)
})