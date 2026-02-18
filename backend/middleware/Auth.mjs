import jwt from "jsonwebtoken"
import "dotenv/config"
export default async function VerifyAuth(req,res){
    //retieve the token
    const token = req.headers["authorization"].split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"no token passed";
        })
    }
    //verify the token
    jwt.verify(token,process.env.JWT,(err,decoded)=>{
        if(err){
            return res.status(403).json({
                message:"Invalid token or expired"
            })
        }
        //return the payload
        req.user = decoded;
    })

}
