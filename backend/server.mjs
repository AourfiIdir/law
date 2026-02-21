import express from "express"
import "dotenv/config"
import cors from "cors"
import {connectDB} from "../backend/connectDb.mjs"
const app = express();
const PORT=process.env.PORT;
app.use(cors());


connectDB().then(()=>{
app.listen(PORT,()=>{
    console.log(`app start listening in ${PORT}`);
})
})



