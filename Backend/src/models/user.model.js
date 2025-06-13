import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profilepic:{
        type:String,
        default:""
    }

},{timestamps:true}  //timestamps add those time field for createAt updatedAt
)  

const User=mongoose.model("User",userSchema);
export default User