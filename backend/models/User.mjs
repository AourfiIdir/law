import mongoose from "mongoose"
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    prenom:{
        type:String;
        required:true
    },
    role:{
        type:String,
        enum : ["admin","user"]
    },
    password:{
        type:String,
        minlength:[6,"Password must be at least 6 characters"];
        select:false
    },
    email:{
        type:String,
        required :[true,"Email is required"],
        unique:true
    },
    wilaya:{
        type:String,
        enum:["Bejaia","Alger"]
    }

});

UserSchema.pre("save",async ()=>{
    if(this.isModified("password")){
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password,saltRounds);
    }       
})


export default mongoose.model("User",UserSchema);
