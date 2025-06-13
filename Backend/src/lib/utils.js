import jwt from "jsonwebtoken"
// import User from "../models/user.model"

const generateToken=(userId,res)=>{
    // console.log("cch");
    
    const token= jwt.sign({userId},
    process.env.JWT_SECRET,{
        expiresIn:"8d"
    })

    // console.log(token)
    //token generated
    //now
    //sending it to the user in a cookie
    res.cookie("jwt",token,{
        maxAge:25*24*60*60*1000,   //multiplied by 1000 to convert to milliseconds
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !=="development"
    })
    return token;

}

export default generateToken
 // const token= jwt.sign({
    //     _id:this._id,
    //     fullName:this.fullName,
    //     email:this.email,
    //     password:this.password
    // },
