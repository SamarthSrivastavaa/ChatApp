import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Truck } from "lucide-react";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false, //so we can show some skeleton while they load
    isMessagesloading:false,
    getUsers:async()=>{
        set({isUsersLoading:true})
        try {
            const res=await axiosInstance.get("/messages/users");
            set({users:res.data});

        } catch (error) {
            toast.error("error.response.data.message");
        }
        finally{
            set({isUsersLoading:false});
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoading:true})
        try {
            const res=await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});

        } catch (error) {
            toast.error("error.response.data.message");
        }
        finally{
            set({isMessagesLoading:false});
        }
    },
    setSelectedUser:(selectedUser)=>{
        set({selectedUser})
    },
    sendMessage:async(messageData)=>{
        const {selectedUser,messages}=get()
        try {
            const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]}) /*All current messages (...messages) Plus the new message (res.data) at the end -->UPDATED THE MESSAGE ARRAY WITH NEW ENTRY*/
            
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

}))