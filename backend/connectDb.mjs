import mongoose from "mongoose"
import "dotenv/config"
const URL = process.env.DB_URL
if (!URL) throw new Error("DB_URL is not set");
export const connectDB = async ()=>{
    try{
        await mongoose.connect(URL);
        console.log("Connected to the database successfully");
    }catch(err){
        console.error("Failed to connect to the database");
        process.exit(1);
    }
}

export const disconnect = async ()=>{
  await mongoose.disconnect();
  console.log("Disconnected.");
}

