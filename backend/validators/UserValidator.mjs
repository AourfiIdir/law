import * as z from "zod";

export default const User = z.object({
    nom:z.string(),
    prenom:z.string(),
    email:z.email(),
    password:z.string().min(6),
    confirm:z.string().min(6)
}).refine((data)=>data.password === data.confirm,{
    message: "Passwords don't match",
    path: ["confirm"]
});
