import express from "express"
import "dotenv/config"
import cors from "cors"
import {connectDB} from "../backend/connectDb.mjs"
const app = express();
const PORT=process.env.PORT;
const URL=process.env.DB_URL;
app.use(cors());


connectDB(URL).then(()=>{
app.listen(PORT,()=>{
    console.log(`app start listening in ${PORT}`);
})
})

