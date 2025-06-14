import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar=async(req,res)=>{
    try {
        //since its a protected route we can direclt access the userId from req
        const loggedInUserId=req.user._id;   //currentUserID->we need all users in sidebar user list except our own name..why mssg yrself 
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password")  //all users where _id is NotEqual to userId(current users)
        res.status(200).json(filteredUsers)
        
    } catch (error) {
        console.log("Error fetching users for sidebar",error);
        return res.status(500).json({message:"Error fetching users for sidebar"});
    }
}

//func to get all messages bw 2 users from userid

//DOUBT: WONT THIS FUNCTION ONLY SHOW CHATS FROM SENDER TO RECEIVER INSTEAD OF BOTH THE SIDES CHAT..CZ OF THIS LINE $or:[{receiverId:userToChatId},{senderId:myId}]
//SHOULDNT IT BE BOTH THE CONDITIONS TO SEE ALL CHATS OTHERWISE USER1 CAN SEE MESSAGES HE SENT WHEN HE HITS/USER/V1/AUTH/MESSAGES/ID  AND VICE VERSA
export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.user._id;
        const messages=await Message.find({
            /*$.or:[{receiverId:userToChatId},{senderId:myId}] //wrong only fetches one side mssgs which was causing the bug debug2*/
            $or:[
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }
    );
        res.status(200).json(messages)

    } catch (error) {
        console.log("Some error occured while getting messages",error);
        res.status(500).json({message:"Some error occured while getting messages"})
    }
}

export const sendMessages=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;  //since protected route

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage=await Message.create({
            senderId,
            receiverId,
            text:text,
            image:imageUrl
        })
        // console.log(newMessage)

        // await newMessage.save(); if not create used above
//REAL TIME FUNCTIONALITY USING socket.io WILL BE IMPLEMENTED HERE LATER
        return res.status(201).json(newMessage);

    } catch (error) {
        console.log("Some error occured while sending the message",error);
        return res.status(500).json({message:"Some error occured while sending the message"});
    }
}