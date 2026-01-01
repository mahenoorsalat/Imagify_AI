import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => {

        console.log("Database connected")

    })
    const uri = `${process.env.MONGODB_URI}/imagify`;
    console.log("Attempting to connect to MongoDB URI:", uri);
    await mongoose.connect(uri)
}

export default connectDB;

// const connectDB = async () =>{
//     mongoose.connection.on('connected' , ()=>{
//         console.log("Database Connected")
//     })
//     await mongoose.connect(`${process.env.MONGODB_URI}/imagify`)
// }