import mongoose from "mongoose"
import "dotenv/config"
const URL = process.env.DB_URL

export const connectDB = async ()=>{
    try{
        await mongoose.connect(URL);
        console.log("Connected to the database successfully");
    }catch(err){
        console.error("Failed to connect to the database");
        process.exit();
    }
}

export const disconnect = async ()=>{
  await mongoose.disconnect();
  console.log("Disconnected.");
}

