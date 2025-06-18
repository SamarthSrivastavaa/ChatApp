//here well have a bunch of diff states and functions we can use in the app anywhere..isit sorta like cintext api
import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL="http://localhost:5001"
//as we login/signup we immediately cnnct to socket
//after checkAuth too as it checks if the user's been authenticated or not at every refresh so connection to socket'll also be done for auth'ed users after evry rfrsh

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
                get().connectSocket()
                
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
               get().connectSocket()
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
            get().disconnectSocket()  //disconnecting socket after logout
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
        connectSocket:()=>{
            const {authUser}=get()
            //if user not authenticated.//or alr connecteddont try to even create this connection
            if (!authUser || get().socket?.connected) return;
            const socket=io(BASE_URL,{
                query:{
                    userId:authUser._id
                }
            });
            socket.connect()  //opens the socket

            set({socket:socket});

            //setting the online users array..all connceted to socket
            socket.on("getOnlineUsers",(userIds)=>{
                set({onlineUsers:userIds})
            })
           
        },
        disconnectSocket:()=>{
            //if connected->disc
            if(get().socket?.connected()){
                get().socket.disconnect()
            }
        }

    }
))

/*Looks up an existing Manager for multiplexing. If the user summons:
io('http://localhost/a'); io('http://localhost/b');
We reuse the existing instance based on same scheme/port/host, and we initialize sockets for each namespace.

 */