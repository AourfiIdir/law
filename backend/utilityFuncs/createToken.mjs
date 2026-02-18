import "dotenv/config"
import jwt from "jsonwebtoken";

export default async function createToken(payload){
    return jwt.sign(payload,process.env.JWT,{expiresIn:"15m"});
}
