import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async() => {
    try {
        const connecting = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
        console.log(`✅ MongoDB Connected: ${connecting.connection.host}`)
    } 
    catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`)
        process.exit(1)
    }   
}

export default connectDB