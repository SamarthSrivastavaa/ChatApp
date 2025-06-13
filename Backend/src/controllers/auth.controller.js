import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateToken from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js";

export const signup=async(req,res)=>{
    // res.send("signup route");
    // console.log("hey")
    const {email,password,fullName}=req.body;
   console.log(email)
    try {
        if(password.length<6){
            return res.status(400).json({message:"The minimum password length must be 6 characters"});
        }
            const useralr=await User.findOne({email})
        if(useralr){
                return res.status(400).json({message:"User with email already exists!Login maybe?"});
         }
            if([email,password,fullName].some((field)=>field==="")){
         return res.status(400).json({ error: "All fields are required" });
         }

         //encrypting/hashing the password
         const salt=await bcrypt.genSalt(10)  //asyncly generates a salt
         const hashedpassword=await bcrypt.hash(password,salt);  //hash the user pass with the generated salt
        // console.log(hashedpassword)
         const newUser=new User({
            fullName:fullName,
            email:email,
            password:hashedpassword,
            
         })
        //  console.log(newUser)
         if(newUser){
            //generate the token..lib>utils
            // console.log("check b4 token")
            generateToken(newUser._id,res);  //sends the cookie in response
            console.log("token generated")
            await newUser.save();   
           console.log(newUser)
            res.status(201).json({
                _id:newUser._id,
                email:newUser.email,
                password:newUser.password,
                profilepic:newUser.profilepic
            })   
         }
         else{
            res.status(400).json({message:"Something went wrong while creating the user"})
         }
        
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Something went wrong while signing up"})
    }
    
}


export const login=async(req,res)=>{
    // res.send("login route");
   try {
    
     const {email,password}=req.body;
     const user=await User.findOne({email});
     console.log(user)
     if(!user){
         return res.status(400).json({message:"User with the given credentials not found!"});
         
     }
     if(user){
      
        // console.log(user.password);
        console.log(password);
         const correctpass=await bcrypt.compare(password,user.password);
         console.log(correctpass);
         
         
         if(correctpass){
            generateToken(user._id,res);
            res.status(201).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                // password:newUser.password,
                profilepic:user.profilepic
            })  
         }
         else{
            res.status(401).json({message:"Incorrect password"})
         }

     }
   } catch (error) {
        res.status(500).json({message:"Some problem occured while logging in!"});
        // console.log(error)
   }
}

export const logout=(req,res)=>{
    //just clear out the cookies
    try {
        res.cookie("jwt","",{maxAge:0});
        return res.status(200).json({message:"User logged out successfully"});
    } catch (error) {
        return res.status(500).json({message:"Some error occured while logging out"})
    }
    
}

export const updateProfile=async(req,res)=>{
    try {

        const {profilepic}=req.body;
        const userId=req.user._id;

        if(!profilepic){
            return res.status(401).json({message:"Profile pic is needed!"})
        }
        console.log(profilepic)
        const uploadResponse=await cloudinary.uploader.upload(profilepic);
        console.log(uploadResponse)
        const updatedUser=await User.findByIdAndUpdate(
            userId,{
                $set:{
                    profilepic:uploadResponse.secure_url
                }
            },{new:true}
        )

        
        return res.status(200).json(updatedUser); //updated to return user and not message of updation whule writing frontend

    } 
    catch (error) {
        return res.status(500).json({message:"Some error occured whule updating the profile"})
    }
}

export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user);  //gives back the authenticated user
    } catch (error) {
        console.log("Error in checkAuth controller",error.message)
        res.status(500).json({message:"Something went wrong in checkAuth controller"})

    }
}
//THIS ABOVE CHECKaUTH FUNC is a visual check for login/logout..login kro and the auth will return the logged in user from the cookie jwt..as soon as
//you logout and checkauth it returns invalid token not found...