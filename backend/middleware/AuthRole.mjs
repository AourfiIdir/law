
export default async function AuthRole(roles){
    return (req,res,next)=>{
        const role = req.user.role;
        if(!role){
            return res.status(500).json({
                message:"problem in retrieving the role from user"
            })
        }
        if(!roles.includes(role)){
            return res.status(403).json({
                message:"not authorized"
            })
        }
        next();

    }
}
