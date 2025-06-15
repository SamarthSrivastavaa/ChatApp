//here well have a bunch of diff states and functions we can use in the app anywhere..isit sorta like cintext api
import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";

//as we login we immediately cnnct to socket

export const useAuthStore=create((set,get)=>(
    //now you can destructure the useAuthStore and use any state anywhere in the codebase
    {
        authUser:null,
        isSigningUp:false,
        isLoggingIn:false,
        isUpdatingProfile:false,
        isCheckingAuth:true,
        onlineUsers:[],
        socket:null,
        checkAuth:async()=>{//well call this func as sooon aswe visit our app..see app.jsx
            try {
                const res=await axiosInstance.get("/auth/check");
                console.log("check response" ,res.data)
                set({authUser:res.data})   //setting auth state with the response.data
                
            } catch (error) {
                console.log("Error in checkAuth",error)
            }
            finally{
                set({isCheckingAuth:false})
            }
        },

        signup:async(data)=>{
            set({isSigningUp:true})
            try {
               const res=await axiosInstance.post("/auth/signup",data)
               set({authUser:res.data})
                toast.success("Account created successfully!");
            } catch (error) {
                toast.error(error.response.data.message)
            }
            finally{
                set({isSigningUp:false})
            }
        },

        logout:async()=>{
           try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null})
            toast.success("User successfully logged out")
           } catch (error) {
            toast.error(error.response.data.message)
           } 
        },
        login:async(data)=>{
            try {
                const res=await axiosInstance.post("/auth/login",data)
                set({authUser:res.data})
                get().connectSocket()  //connecting socket immediately after login
                toast.success("Logged in successfully")
            } catch (error) {
                toast.error("Error logging in")
            }
        },
        updateProfilePic:async(data)=>{
            set({isUpdatingProfile:true})
            try {
                const res=await axiosInstance.put("/auth/update-profile",data)
                set({authUser:res.data})
                toast.success("Profile Pic updated!")
            } catch (error) {
                toast.error("Couldn't update profile pic")
            }
            finally{
                set({isUpdatingProfile:false})
            }
        },
        getSocket:()=>{
            
        }
    }
))
