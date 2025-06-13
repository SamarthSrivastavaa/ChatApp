import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute=async(req,res,next)=>{
    try {
        // console.log(req.cookies)
        const token=req.cookies.jwt;
        
        if(!token){
            return res.status(401).json({message:"Unauthorized! No token provided"})
        }
        //gotta decode the token if it exists..to grab info like userId from it
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized-Token is invalid1"});
        }
        //now the decoded form of the token contains the verified id
        const user=await User.findById(
            decoded.userId         
        ).select("-password")

        if(!user){
            return res.status(404).json({message:"User not found!"});
        }
        //setting the req to be passed
        req.user=user
        next();    //nxt to middleware called then


    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong while route protection!"})
    }
}